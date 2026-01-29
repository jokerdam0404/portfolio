/**
 * Wormhole Ray Tracing Shader
 *
 * GPU-accelerated ray tracing through Morris-Thorne wormhole geometry.
 * Based on the methodology described in:
 * - James et al. (2015) "Visualizing Interstellar's Wormhole" arXiv:1502.03809
 *
 * This shader implements:
 * 1. Null geodesic integration using 4th-order Runge-Kutta
 * 2. Adaptive step sizing based on local spacetime curvature
 * 3. Christoffel symbol calculation for the Morris-Thorne metric
 * 4. Celestial sphere mapping for visualization
 * 5. Gravitational redshift and Doppler effects
 *
 * Mathematical Framework:
 * ========================
 *
 * Morris-Thorne Metric (proper radial coordinate l):
 * ds² = -c²dt² + dl² + r(l)²(dθ² + sin²θ dφ²)
 *
 * where r(l) = √(b₀² + l²) is the circumferential radius
 * and b₀ is the throat radius (minimum radius).
 *
 * The Christoffel symbols (connection coefficients) are:
 * Γˡ_θθ = -r(dr/dl) = -l
 * Γˡ_φφ = -r sin²θ (dr/dl) = -l sin²θ
 * Γᶿ_lθ = Γᶿ_θl = (dr/dl)/r = l/(b₀² + l²)
 * Γᶿ_φφ = -sinθ cosθ
 * Γᵠ_lφ = Γᵠ_φl = (dr/dl)/r = l/(b₀² + l²)
 * Γᵠ_θφ = Γᵠ_φθ = cotθ
 *
 * Geodesic Equation:
 * d²xᵘ/dλ² + Γᵘ_αβ (dxᵅ/dλ)(dxᵝ/dλ) = 0
 *
 * For null geodesics (light rays), λ is an affine parameter.
 */

precision highp float;

// ============================================================
// CONSTANTS
// ============================================================

const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
const float HALF_PI = 1.57079632679;

// Integration parameters
const int MAX_STEPS = 300;
const float MIN_STEP = 0.001;
const float MAX_STEP = 0.5;
const float ESCAPE_RADIUS = 100.0;
const float THETA_EPSILON = 0.001;

// ============================================================
// UNIFORMS
// ============================================================

uniform float time;
uniform vec2 resolution;
uniform vec3 cameraPosition;
uniform vec3 cameraTarget;
uniform float cameraFov;

// Wormhole parameters
uniform float throatRadius;      // b₀
uniform float wormholeLength;    // W
uniform float mass;              // M (for lensing)
uniform float spin;              // a (for Kerr-like extension)

// Rendering options
uniform bool showAccretionDisk;
uniform bool showEinsteinRing;
uniform bool applyRedshift;
uniform float diskInnerRadius;
uniform float diskOuterRadius;

// Textures
uniform sampler2D celestialTexture;      // Our universe
uniform sampler2D celestialTextureOther; // Other universe
uniform sampler2D accretionDiskTexture;

// ============================================================
// DATA STRUCTURES
// ============================================================

/**
 * Ray state in phase space
 * Position: (l, θ, φ) - spherical coordinates with l as proper radial distance
 * Momentum: (p_l, p_θ, p_φ) - conjugate momenta
 */
struct RayState {
    float l;        // Proper radial distance from throat
    float theta;    // Polar angle [0, π]
    float phi;      // Azimuthal angle [0, 2π]
    float pl;       // Radial momentum
    float pTheta;   // Polar momentum
    float pPhi;     // Azimuthal momentum (conserved)
};

/**
 * Christoffel symbols for Morris-Thorne metric
 */
struct Christoffel {
    float l_thetaTheta;
    float l_phiPhi;
    float theta_lTheta;
    float theta_phiPhi;
    float phi_lPhi;
    float phi_thetaPhi;
};

/**
 * Ray tracing result
 */
struct RayResult {
    bool escaped;           // Did ray escape to infinity?
    bool passedThrough;     // Did ray pass through throat?
    float finalL;           // Final l coordinate
    float finalTheta;       // Final θ coordinate
    float finalPhi;         // Final φ coordinate
    float minRadius;        // Minimum radius reached
    float pathLength;       // Affine parameter accumulated
    float redshift;         // Gravitational redshift factor
};

// ============================================================
// METRIC FUNCTIONS
// ============================================================

/**
 * Circumferential radius r(l)
 * This is the radius measured by circumference/2π at proper distance l
 */
float circumferentialRadius(float l) {
    return sqrt(throatRadius * throatRadius + l * l);
}

/**
 * Derivative dr/dl
 */
float drDl(float l) {
    return l / circumferentialRadius(l);
}

/**
 * Compute Christoffel symbols at position (l, θ)
 *
 * These are derived from the Morris-Thorne metric:
 * Γᵘ_αβ = (1/2) gᵘᵛ (∂_α g_βν + ∂_β g_αν - ∂_ν g_αβ)
 */
Christoffel computeChristoffel(float l, float theta) {
    Christoffel gamma;

    float r = circumferentialRadius(l);
    float drdl = drDl(l);
    float sinTheta = sin(theta);
    float cosTheta = cos(theta);

    // Non-zero Christoffel symbols for Morris-Thorne metric
    gamma.l_thetaTheta = -r * drdl;                    // Γˡ_θθ
    gamma.l_phiPhi = -r * drdl * sinTheta * sinTheta;  // Γˡ_φφ
    gamma.theta_lTheta = drdl / r;                      // Γᶿ_lθ
    gamma.theta_phiPhi = -sinTheta * cosTheta;          // Γᶿ_φφ
    gamma.phi_lPhi = drdl / r;                          // Γᵠ_lφ
    gamma.phi_thetaPhi = cosTheta / max(sinTheta, THETA_EPSILON); // Γᵠ_θφ (cot θ)

    return gamma;
}

/**
 * Metric components g_μν
 */
vec4 metricComponents(float l, float theta) {
    float r = circumferentialRadius(l);
    float sinTheta = sin(theta);

    return vec4(
        -1.0,                           // g_tt
        1.0,                            // g_ll
        r * r,                          // g_θθ
        r * r * sinTheta * sinTheta     // g_φφ
    );
}

// ============================================================
// GEODESIC INTEGRATION
// ============================================================

/**
 * Compute derivatives for geodesic equation
 *
 * Hamilton's equations:
 * dl/dλ = p_l
 * dθ/dλ = p_θ / r²
 * dφ/dλ = p_φ / (r² sin²θ)
 *
 * dp_l/dλ = -Γˡ_αβ pᵅ pᵝ
 * dp_θ/dλ = -Γᶿ_αβ pᵅ pᵝ
 * dp_φ/dλ = 0 (conserved due to axial symmetry)
 */
RayState geodesicDerivatives(RayState state) {
    RayState deriv;

    float r = circumferentialRadius(state.l);
    float r2 = r * r;
    float r4 = r2 * r2;
    float sinTheta = sin(state.theta);
    float sin2Theta = sinTheta * sinTheta;
    float sin4Theta = sin2Theta * sin2Theta;

    Christoffel gamma = computeChristoffel(state.l, state.theta);

    // Position derivatives (from Hamiltonian)
    deriv.l = state.pl;
    deriv.theta = state.pTheta / r2;
    deriv.phi = state.pPhi / (r2 * sin2Theta + 1e-10);

    // Momentum derivatives (geodesic equation)
    // dp_l/dλ = -Γˡ_θθ (p_θ)² / r⁴ - Γˡ_φφ (p_φ)² / (r⁴ sin⁴θ)
    deriv.pl = -gamma.l_thetaTheta * state.pTheta * state.pTheta / r4
              - gamma.l_phiPhi * state.pPhi * state.pPhi / (r4 * sin4Theta + 1e-10);

    // dp_θ/dλ = -2 Γᶿ_lθ p_l p_θ / r² - Γᶿ_φφ (p_φ)² / (r⁴ sin⁴θ)
    deriv.pTheta = -2.0 * gamma.theta_lTheta * state.pl * state.pTheta / r2
                  - gamma.theta_phiPhi * state.pPhi * state.pPhi / (r4 * sin4Theta + 1e-10);

    // dp_φ/dλ = 0 (axial symmetry)
    deriv.pPhi = 0.0;

    return deriv;
}

/**
 * Add two ray states (for RK4)
 */
RayState addStates(RayState a, RayState b, float scale) {
    RayState result;
    result.l = a.l + b.l * scale;
    result.theta = a.theta + b.theta * scale;
    result.phi = a.phi + b.phi * scale;
    result.pl = a.pl + b.pl * scale;
    result.pTheta = a.pTheta + b.pTheta * scale;
    result.pPhi = a.pPhi + b.pPhi * scale;
    return result;
}

/**
 * Fourth-order Runge-Kutta integration step
 *
 * This provides O(h⁴) accuracy where h is the step size.
 * The method is:
 * k₁ = f(yₙ)
 * k₂ = f(yₙ + h k₁/2)
 * k₃ = f(yₙ + h k₂/2)
 * k₄ = f(yₙ + h k₃)
 * yₙ₊₁ = yₙ + h(k₁ + 2k₂ + 2k₃ + k₄)/6
 */
RayState rk4Step(RayState state, float dt) {
    RayState k1 = geodesicDerivatives(state);
    RayState k2 = geodesicDerivatives(addStates(state, k1, dt * 0.5));
    RayState k3 = geodesicDerivatives(addStates(state, k2, dt * 0.5));
    RayState k4 = geodesicDerivatives(addStates(state, k3, dt));

    RayState result;
    result.l = state.l + dt * (k1.l + 2.0*k2.l + 2.0*k3.l + k4.l) / 6.0;
    result.theta = state.theta + dt * (k1.theta + 2.0*k2.theta + 2.0*k3.theta + k4.theta) / 6.0;
    result.phi = state.phi + dt * (k1.phi + 2.0*k2.phi + 2.0*k3.phi + k4.phi) / 6.0;
    result.pl = state.pl + dt * (k1.pl + 2.0*k2.pl + 2.0*k3.pl + k4.pl) / 6.0;
    result.pTheta = state.pTheta + dt * (k1.pTheta + 2.0*k2.pTheta + 2.0*k3.pTheta + k4.pTheta) / 6.0;
    result.pPhi = state.pPhi; // Conserved

    return result;
}

/**
 * Adaptive step size based on local curvature
 *
 * Near the throat, spacetime curvature is higher, requiring smaller steps.
 * The step size scales with r/b₀ to maintain accuracy.
 */
float adaptiveStepSize(RayState state, float baseStep) {
    float r = circumferentialRadius(state.l);
    float curvatureScale = r / throatRadius;

    // Also reduce step size near poles (θ → 0 or π)
    float thetaScale = sin(state.theta);

    return baseStep * clamp(curvatureScale * thetaScale, 0.1, 1.0);
}

// ============================================================
// RAY TRACING
// ============================================================

/**
 * Trace a null geodesic through the wormhole
 */
RayResult traceRay(RayState initialState) {
    RayResult result;
    result.escaped = false;
    result.passedThrough = false;
    result.minRadius = 1e10;
    result.pathLength = 0.0;
    result.redshift = 1.0;

    RayState state = initialState;
    float baseStep = 0.1;
    float initialSign = sign(state.l);

    for (int i = 0; i < MAX_STEPS; i++) {
        // Adaptive step size
        float dt = adaptiveStepSize(state, baseStep);

        // RK4 integration
        state = rk4Step(state, dt);
        result.pathLength += dt;

        // Track minimum radius
        float r = circumferentialRadius(state.l);
        result.minRadius = min(result.minRadius, r);

        // Check if passed through throat
        if (sign(state.l) != initialSign && !result.passedThrough) {
            result.passedThrough = true;
        }

        // Boundary checks
        // Theta bounds
        state.theta = clamp(state.theta, THETA_EPSILON, PI - THETA_EPSILON);

        // Check escape condition
        if (r > ESCAPE_RADIUS * throatRadius) {
            result.escaped = true;
            break;
        }
    }

    result.finalL = state.l;
    result.finalTheta = state.theta;
    result.finalPhi = mod(state.phi, TWO_PI);

    // Calculate gravitational redshift
    float z = 1.0 - sqrt(max(1.0 - 2.0 * mass / result.minRadius, 0.01));
    result.redshift = z;

    return result;
}

// ============================================================
// COLOR CALCULATIONS
// ============================================================

/**
 * Sample celestial sphere texture
 */
vec3 sampleCelestialSphere(float theta, float phi, bool isOtherUniverse) {
    // Convert to UV coordinates
    float u = mod(phi, TWO_PI) / TWO_PI;
    float v = theta / PI;

    vec2 uv = vec2(u, v);

    if (isOtherUniverse) {
        return texture2D(celestialTextureOther, uv).rgb;
    } else {
        return texture2D(celestialTexture, uv).rgb;
    }
}

/**
 * Procedural celestial sphere (fallback)
 */
vec3 proceduralCelestialSphere(float theta, float phi, bool isOtherUniverse) {
    vec2 uv = vec2(mod(phi, TWO_PI) / TWO_PI, theta / PI);

    // Star field using noise
    vec2 seed = uv * 200.0;
    float noise = fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
    float starBrightness = step(0.997, noise);

    // Milky Way band
    float milkyWay = exp(-pow((theta - HALF_PI) * 4.0, 2.0));
    milkyWay *= 0.2 * (0.5 + 0.5 * sin(phi * 6.0 + noise * 5.0));

    // Color scheme depends on universe
    vec3 starColor = isOtherUniverse
        ? vec3(1.0, 0.8, 0.6)  // Warm (other universe)
        : vec3(0.9, 0.95, 1.0); // Cool (our universe)

    vec3 color = starColor * starBrightness;
    color += milkyWay * starColor;

    return color;
}

/**
 * Einstein ring contribution
 */
vec3 einsteinRingColor(float impactParameter) {
    float ringRadius = throatRadius * 1.5 * sqrt(4.0 * mass);
    float ringWidth = 0.1 * throatRadius;

    float ring = exp(-pow((impactParameter - ringRadius) / ringWidth, 2.0));
    return vec3(1.0, 0.95, 0.8) * ring * 2.0;
}

/**
 * Accretion disk color with Doppler beaming
 */
vec3 accretionDiskColor(float r, float phi, float viewAngle) {
    if (r < diskInnerRadius || r > diskOuterRadius) {
        return vec3(0.0);
    }

    // Temperature profile: T ~ r^(-3/4) for thin disk
    float temperature = pow(diskInnerRadius / r, 0.75);

    // Keplerian orbital velocity
    float orbitalVelocity = sqrt(mass / r);

    // Doppler factor (simplified)
    float beta = orbitalVelocity * 0.3;
    float dopplerFactor = pow(1.0 + beta * cos(phi - viewAngle), 3.0);

    // Black body color
    vec3 diskColor;
    if (temperature > 0.8) {
        diskColor = vec3(1.0, 0.9, 0.8);
    } else if (temperature > 0.5) {
        diskColor = vec3(1.0, 0.6, 0.2);
    } else {
        diskColor = vec3(0.8, 0.2, 0.1);
    }

    // Apply Doppler shift
    float dopplerSign = cos(phi - viewAngle);
    if (dopplerSign > 0.0) {
        // Blueshift
        diskColor.b *= 1.2;
        diskColor.r *= 0.8;
    } else {
        // Redshift
        diskColor.r *= 1.2;
        diskColor.b *= 0.7;
    }

    return diskColor * temperature * dopplerFactor;
}

/**
 * Apply gravitational redshift to color
 */
vec3 applyGravitationalRedshift(vec3 color, float z) {
    if (z > 0.0) {
        // Redshift
        return vec3(color.r, color.g * (1.0 - z * 0.3), color.b * (1.0 - z * 0.5));
    } else {
        // Blueshift
        float absZ = abs(z);
        return vec3(color.r * (1.0 - absZ * 0.5), color.g * (1.0 - absZ * 0.3), color.b);
    }
}

// ============================================================
// MAIN SHADER
// ============================================================

/**
 * Convert screen coordinates to initial ray direction
 */
RayState initializeRay(vec2 screenPos, vec3 camPos, vec3 camDir) {
    RayState ray;

    // Camera distance from origin
    float camDist = length(camPos);

    // Spherical coordinates of camera
    ray.l = camDist;
    ray.theta = acos(camPos.z / camDist);
    ray.phi = atan(camPos.y, camPos.x);

    // Initial momentum (pointing toward wormhole)
    float fovScale = tan(cameraFov * 0.5);
    ray.pl = -1.0;
    ray.pTheta = screenPos.y * fovScale;
    ray.pPhi = screenPos.x * fovScale;

    return ray;
}

void main() {
    // Screen coordinates [-1, 1]
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 screenPos = (uv - 0.5) * 2.0;
    screenPos.x *= resolution.x / resolution.y;

    // Camera setup
    vec3 camPos = cameraPosition;
    vec3 camDir = normalize(cameraTarget - cameraPosition);

    // Initialize ray
    RayState ray = initializeRay(screenPos, camPos, camDir);

    // Trace ray through wormhole
    RayResult result = traceRay(ray);

    // Sample celestial sphere
    bool isOtherUniverse = result.finalL < 0.0;
    vec3 color = proceduralCelestialSphere(result.finalTheta, result.finalPhi, isOtherUniverse);

    // Apply gravitational redshift
    if (applyRedshift) {
        color = applyGravitationalRedshift(color, result.redshift);
    }

    // Add Einstein ring
    if (showEinsteinRing) {
        float impactParam = length(screenPos) * length(cameraPosition) * 0.5;
        color += einsteinRingColor(impactParam);
    }

    // Add accretion disk (if visible)
    if (showAccretionDisk) {
        float viewAngle = atan(screenPos.y, screenPos.x);
        color += accretionDiskColor(result.minRadius, result.finalPhi, viewAngle);
    }

    // Throat glow
    float throatGlow = exp(-pow(length(screenPos) / 2.0, 2.0)) * 0.2;
    color += vec3(0.3, 0.5, 1.0) * throatGlow;

    // Tone mapping (simple Reinhard)
    color = color / (1.0 + color);

    // Vignette
    float vignette = 1.0 - length(screenPos) * 0.2;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}
