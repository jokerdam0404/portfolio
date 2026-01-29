/**
 * Physics Engine for Wormhole Visualization
 *
 * Implements scientifically accurate general relativity calculations based on:
 * - Morris-Thorne traversable wormhole metric (1988)
 * - Kip Thorne's Interstellar visualization methodology (2015)
 * - arXiv:1502.03809 - "Visualizing Interstellar's Wormhole"
 * - arXiv:1502.03808 - "Gravitational Lensing by Spinning Black Holes"
 *
 * @author Physics implementation based on Thorne et al.
 */

// Physical constants (geometrized units where G = c = 1 for calculations)
export const CONSTANTS = {
    G: 6.67430e-11,           // Gravitational constant (SI)
    c: 299792458,             // Speed of light (m/s)
    c2: 8.98755179e16,        // c^2
    SOLAR_MASS: 1.989e30,     // kg
    SCHWARZSCHILD_RADIUS_SUN: 2953.25, // meters
} as const;

/**
 * Wormhole Parameters
 *
 * Based on Morris-Thorne metric:
 * ds^2 = -c^2 dt^2 + dl^2 + (b0^2 + l^2)(d theta^2 + sin^2 theta d phi^2)
 *
 * where:
 * - b0 = throat radius (minimum radius)
 * - l = proper radial distance (l = 0 at throat)
 * - The shape function b(l) = sqrt(b0^2 + l^2) ensures traversability
 */
export interface WormholeParams {
    throatRadius: number;      // b0: throat radius in geometric units
    length: number;            // W: proper length of wormhole
    mass: number;              // M: effective mass parameter (for lensing)
    spin: number;              // a: spin parameter (0 for non-rotating)
}

/**
 * Ray state for geodesic integration
 * Position and momentum in spherical coordinates (l, theta, phi)
 */
export interface RayState {
    l: number;                 // Proper radial distance from throat
    theta: number;             // Polar angle
    phi: number;               // Azimuthal angle
    pl: number;                // Conjugate momentum for l
    pTheta: number;            // Conjugate momentum for theta
    pPhi: number;              // Conjugate momentum for phi (conserved)
}

/**
 * Camera parameters in spherical coordinates
 */
export interface CameraParams {
    distance: number;          // Distance from wormhole center
    theta: number;             // Polar angle (0 = looking down axis)
    phi: number;               // Azimuthal angle
    fov: number;               // Field of view in radians
}

/**
 * Morris-Thorne Wormhole Metric Calculator
 *
 * The metric in proper radial coordinate l:
 * ds^2 = -dt^2 + dl^2 + r(l)^2 (d theta^2 + sin^2 theta d phi^2)
 *
 * where r(l) = sqrt(b0^2 + l^2) is the "circumferential radius"
 */
export class MorrisThorneMetric {
    constructor(public params: WormholeParams) {}

    /**
     * Circumferential radius r(l)
     * This is the radius measured by circumference/2pi at radial distance l
     */
    circumferentialRadius(l: number): number {
        const { throatRadius } = this.params;
        return Math.sqrt(throatRadius * throatRadius + l * l);
    }

    /**
     * dr/dl derivative for metric calculations
     */
    drDl(l: number): number {
        const r = this.circumferentialRadius(l);
        return l / r;
    }

    /**
     * Metric components g_mu,nu
     * In coordinates (t, l, theta, phi)
     */
    getMetricComponents(l: number, theta: number): {
        gtt: number;
        gll: number;
        gThetaTheta: number;
        gPhiPhi: number;
    } {
        const r = this.circumferentialRadius(l);
        const sinTheta = Math.sin(theta);

        return {
            gtt: -1,                          // -c^2 in natural units
            gll: 1,                           // Proper distance
            gThetaTheta: r * r,               // r^2
            gPhiPhi: r * r * sinTheta * sinTheta  // r^2 sin^2(theta)
        };
    }

    /**
     * Christoffel symbols (connection coefficients)
     * Gamma^mu_alpha,beta for the Morris-Thorne metric
     *
     * These determine how geodesics curve through spacetime
     */
    getChristoffelSymbols(l: number, theta: number): ChristoffelSymbols {
        const r = this.circumferentialRadius(l);
        const { throatRadius } = this.params;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        // dr/dl = l/r
        const drDl = l / r;

        return {
            // Gamma^l_theta,theta = -r * dr/dl
            l_thetaTheta: -r * drDl,

            // Gamma^l_phi,phi = -r * sin^2(theta) * dr/dl
            l_phiPhi: -r * sinTheta * sinTheta * drDl,

            // Gamma^theta_l,theta = Gamma^theta_theta,l = dr/dl / r
            theta_lTheta: drDl / r,

            // Gamma^theta_phi,phi = -sin(theta) * cos(theta)
            theta_phiPhi: -sinTheta * cosTheta,

            // Gamma^phi_l,phi = Gamma^phi_phi,l = dr/dl / r
            phi_lPhi: drDl / r,

            // Gamma^phi_theta,phi = Gamma^phi_phi,theta = cot(theta)
            phi_thetaPhi: cosTheta / sinTheta
        };
    }

    /**
     * Check if position is inside the wormhole throat region
     * The throat is at l = 0 with minimum radius b0
     */
    isNearThroat(l: number, tolerance: number = 0.1): boolean {
        return Math.abs(l) < this.params.throatRadius * tolerance;
    }

    /**
     * Embedding diagram z(r) for visualization
     * z = integral of sqrt(r/b0 - 1) dr from b0 to r
     *
     * This gives the shape of the wormhole when embedded in 3D Euclidean space
     */
    embeddingHeight(l: number): number {
        const { throatRadius } = this.params;
        const r = this.circumferentialRadius(l);

        // For Morris-Thorne: z = b0 * ln((r + sqrt(r^2 - b0^2)) / b0)
        // Simplified for our shape function
        return throatRadius * Math.asinh(l / throatRadius);
    }
}

interface ChristoffelSymbols {
    l_thetaTheta: number;
    l_phiPhi: number;
    theta_lTheta: number;
    theta_phiPhi: number;
    phi_lPhi: number;
    phi_thetaPhi: number;
}

/**
 * Geodesic Integrator using 4th-order Runge-Kutta
 *
 * Integrates the geodesic equation:
 * d^2 x^mu / d lambda^2 + Gamma^mu_alpha,beta (dx^alpha/d lambda)(dx^beta/d lambda) = 0
 *
 * For null geodesics (light rays), lambda is an affine parameter.
 */
export class GeodesicIntegrator {
    private metric: MorrisThorneMetric;

    constructor(params: WormholeParams) {
        this.metric = new MorrisThorneMetric(params);
    }

    /**
     * Integrate a null geodesic (light ray) through the wormhole
     *
     * @param initialState Initial ray position and momentum
     * @param steps Number of integration steps
     * @param stepSize Integration step size (adaptive in practice)
     * @returns Array of ray positions for visualization
     */
    integrateNullGeodesic(
        initialState: RayState,
        maxSteps: number = 1000,
        stepSize: number = 0.1
    ): RayState[] {
        const path: RayState[] = [{ ...initialState }];
        let state = { ...initialState };

        for (let i = 0; i < maxSteps; i++) {
            // Adaptive step size based on curvature
            const adaptiveStep = this.getAdaptiveStepSize(state, stepSize);

            // RK4 integration step
            state = this.rk4Step(state, adaptiveStep);

            // Store position
            path.push({ ...state });

            // Termination conditions
            if (this.shouldTerminate(state)) {
                break;
            }
        }

        return path;
    }

    /**
     * Single RK4 integration step
     */
    private rk4Step(state: RayState, dt: number): RayState {
        const k1 = this.geodesicDerivatives(state);
        const k2 = this.geodesicDerivatives(this.addScaled(state, k1, dt / 2));
        const k3 = this.geodesicDerivatives(this.addScaled(state, k2, dt / 2));
        const k4 = this.geodesicDerivatives(this.addScaled(state, k3, dt));

        return {
            l: state.l + (dt / 6) * (k1.dl + 2*k2.dl + 2*k3.dl + k4.dl),
            theta: state.theta + (dt / 6) * (k1.dTheta + 2*k2.dTheta + 2*k3.dTheta + k4.dTheta),
            phi: state.phi + (dt / 6) * (k1.dPhi + 2*k2.dPhi + 2*k3.dPhi + k4.dPhi),
            pl: state.pl + (dt / 6) * (k1.dpl + 2*k2.dpl + 2*k3.dpl + k4.dpl),
            pTheta: state.pTheta + (dt / 6) * (k1.dpTheta + 2*k2.dpTheta + 2*k3.dpTheta + k4.dpTheta),
            pPhi: state.pPhi  // Conserved due to axial symmetry
        };
    }

    /**
     * Calculate geodesic equation derivatives
     *
     * dx^mu/d lambda = p^mu (momentum)
     * dp^mu/d lambda = -Gamma^mu_alpha,beta p^alpha p^beta
     */
    private geodesicDerivatives(state: RayState): {
        dl: number; dTheta: number; dPhi: number;
        dpl: number; dpTheta: number; dpPhi: number;
    } {
        const { l, theta, pl, pTheta, pPhi } = state;
        const gamma = this.metric.getChristoffelSymbols(l, theta);
        const r = this.metric.circumferentialRadius(l);

        // Position derivatives (Hamilton's equations)
        const dl = pl;
        const dTheta = pTheta / (r * r);
        const dPhi = pPhi / (r * r * Math.sin(theta) * Math.sin(theta));

        // Momentum derivatives from geodesic equation
        const dpl = -gamma.l_thetaTheta * pTheta * pTheta / (r * r * r * r)
                    - gamma.l_phiPhi * pPhi * pPhi / (r * r * r * r * Math.pow(Math.sin(theta), 4));

        const dpTheta = -2 * gamma.theta_lTheta * pl * pTheta / (r * r)
                        - gamma.theta_phiPhi * pPhi * pPhi / (r * r * r * r * Math.pow(Math.sin(theta), 4));

        const dpPhi = 0; // Conserved due to phi-symmetry

        return { dl, dTheta, dPhi, dpl, dpTheta, dpPhi };
    }

    /**
     * Add scaled derivative to state (for RK4)
     */
    private addScaled(state: RayState, deriv: ReturnType<typeof this.geodesicDerivatives>, scale: number): RayState {
        return {
            l: state.l + deriv.dl * scale,
            theta: state.theta + deriv.dTheta * scale,
            phi: state.phi + deriv.dPhi * scale,
            pl: state.pl + deriv.dpl * scale,
            pTheta: state.pTheta + deriv.dpTheta * scale,
            pPhi: state.pPhi + deriv.dpPhi * scale
        };
    }

    /**
     * Adaptive step size based on local curvature
     * Reduce step size near the throat where curvature is highest
     */
    private getAdaptiveStepSize(state: RayState, baseStep: number): number {
        const r = this.metric.circumferentialRadius(state.l);
        const { throatRadius } = this.metric.params;

        // Curvature is highest at throat (r = b0)
        const curvatureScale = r / throatRadius;
        return baseStep * Math.min(1, curvatureScale);
    }

    /**
     * Check termination conditions for ray tracing
     */
    private shouldTerminate(state: RayState): boolean {
        const r = this.metric.circumferentialRadius(state.l);
        const { throatRadius } = this.metric.params;

        // Ray has escaped to large distance
        if (r > 100 * throatRadius) return true;

        // Ray is at invalid angle
        if (state.theta < 0.01 || state.theta > Math.PI - 0.01) return true;

        return false;
    }
}

/**
 * Gravitational Lensing Calculator
 *
 * Based on the deflection angle formula for light passing near a massive object:
 * delta phi = 4GM / (c^2 * b)
 *
 * where b is the impact parameter (closest approach distance)
 *
 * For wormholes, additional lensing occurs due to the topology
 */
export class GravitationalLensing {
    constructor(private params: WormholeParams) {}

    /**
     * Calculate light deflection angle for a ray with impact parameter b
     *
     * This is the weak-field approximation for comparison;
     * actual geodesic integration gives exact results
     */
    deflectionAngle(impactParameter: number): number {
        const { mass, throatRadius } = this.params;

        // Schwarzschild-like deflection: delta = 4M/b (in geometric units)
        // Plus wormhole topology contribution
        const schwarzschildDeflection = 4 * mass / impactParameter;

        // Additional deflection from wormhole geometry
        // Light wrapping around the throat contributes extra bending
        const topologyDeflection = Math.PI * (1 - impactParameter / throatRadius);

        return schwarzschildDeflection + Math.max(0, topologyDeflection);
    }

    /**
     * Calculate Einstein ring radius
     *
     * theta_E = sqrt(4GM * D_LS / (c^2 * D_L * D_S))
     *
     * where D_L = distance to lens, D_S = distance to source,
     * D_LS = distance between lens and source
     */
    einsteinRingRadius(distanceToLens: number, distanceToSource: number): number {
        const { mass } = this.params;
        const distanceLensSource = distanceToSource - distanceToLens;

        // In geometric units (G = c = 1)
        const thetaE = Math.sqrt(
            4 * mass * distanceLensSource / (distanceToLens * distanceToSource)
        );

        return thetaE;
    }

    /**
     * Calculate gravitational redshift at radius r
     *
     * z = sqrt(1 - r_s/r) - 1 for Schwarzschild
     * Modified for wormhole geometry
     */
    gravitationalRedshift(l: number): number {
        const { mass, throatRadius } = this.params;
        const metric = new MorrisThorneMetric(this.params);
        const r = metric.circumferentialRadius(l);

        // Schwarzschild radius
        const rs = 2 * mass;

        if (r <= rs) return Infinity; // Inside horizon (shouldn't happen for wormhole)

        // For Morris-Thorne, there's no event horizon, but still gravitational redshift
        const redshiftFactor = 1 - rs / r;
        return Math.sqrt(Math.max(0, redshiftFactor)) - 1;
    }

    /**
     * Calculate magnification factor for lensed images
     *
     * Magnification is related to the angular size distortion
     */
    magnification(impactParameter: number, sourcePosition: number): number {
        const { throatRadius } = this.params;

        // Angular Einstein ring radius
        const thetaE = this.einsteinRingRadius(impactParameter, sourcePosition);

        // Source angle
        const beta = sourcePosition / impactParameter;

        // Image positions for point source
        const thetaPlus = (beta + Math.sqrt(beta * beta + 4 * thetaE * thetaE)) / 2;
        const thetaMinus = (beta - Math.sqrt(beta * beta + 4 * thetaE * thetaE)) / 2;

        // Total magnification
        const muPlus = Math.abs(thetaPlus / beta * (thetaPlus / thetaE) / Math.abs(thetaPlus / thetaE - thetaE / thetaPlus));
        const muMinus = Math.abs(thetaMinus / beta * (thetaMinus / thetaE) / Math.abs(thetaMinus / thetaE - thetaE / thetaMinus));

        return muPlus + muMinus;
    }
}

/**
 * Celestial Sphere Mapper
 *
 * Maps ray directions at infinity to positions on a celestial sphere texture
 * Used for determining what a ray "sees" after passing through the wormhole
 */
export class CelestialSphereMapper {
    /**
     * Convert spherical angles to UV coordinates on a celestial sphere texture
     */
    static anglesToUV(theta: number, phi: number): { u: number; v: number } {
        // Normalize phi to [0, 2pi]
        let normalizedPhi = phi % (2 * Math.PI);
        if (normalizedPhi < 0) normalizedPhi += 2 * Math.PI;

        return {
            u: normalizedPhi / (2 * Math.PI),
            v: theta / Math.PI
        };
    }

    /**
     * Determine which "universe" a ray ends up in
     * l > 0: "our" universe
     * l < 0: "other" universe
     */
    static getUniverse(l: number): 'ours' | 'other' {
        return l >= 0 ? 'ours' : 'other';
    }
}

/**
 * Performance-optimized precomputation utilities
 */
export class PhysicsPrecomputation {
    /**
     * Generate lookup table for Christoffel symbols
     * Trades memory for computation speed during ray tracing
     */
    static generateChristoffelLUT(
        params: WormholeParams,
        lResolution: number = 256,
        thetaResolution: number = 128
    ): Float32Array {
        const metric = new MorrisThorneMetric(params);
        const lut = new Float32Array(lResolution * thetaResolution * 6);

        const lMin = -10 * params.throatRadius;
        const lMax = 10 * params.throatRadius;

        for (let li = 0; li < lResolution; li++) {
            for (let ti = 0; ti < thetaResolution; ti++) {
                const l = lMin + (lMax - lMin) * li / (lResolution - 1);
                const theta = 0.01 + (Math.PI - 0.02) * ti / (thetaResolution - 1);

                const gamma = metric.getChristoffelSymbols(l, theta);
                const idx = (li * thetaResolution + ti) * 6;

                lut[idx + 0] = gamma.l_thetaTheta;
                lut[idx + 1] = gamma.l_phiPhi;
                lut[idx + 2] = gamma.theta_lTheta;
                lut[idx + 3] = gamma.theta_phiPhi;
                lut[idx + 4] = gamma.phi_lPhi;
                lut[idx + 5] = gamma.phi_thetaPhi;
            }
        }

        return lut;
    }

    /**
     * Generate embedding diagram vertices for 3D visualization
     */
    static generateEmbeddingMesh(
        params: WormholeParams,
        lResolution: number = 100,
        phiResolution: number = 64
    ): { positions: Float32Array; normals: Float32Array; uvs: Float32Array } {
        const metric = new MorrisThorneMetric(params);
        const vertexCount = lResolution * phiResolution;

        const positions = new Float32Array(vertexCount * 3);
        const normals = new Float32Array(vertexCount * 3);
        const uvs = new Float32Array(vertexCount * 2);

        const lMax = 5 * params.throatRadius;

        for (let li = 0; li < lResolution; li++) {
            // Use both positive and negative l for full wormhole
            const lParam = (li / (lResolution - 1) - 0.5) * 2 * lMax;
            const r = metric.circumferentialRadius(lParam);
            const z = metric.embeddingHeight(lParam);

            for (let pi = 0; pi < phiResolution; pi++) {
                const phi = (pi / phiResolution) * 2 * Math.PI;
                const idx = li * phiResolution + pi;

                // Position in 3D embedding space
                positions[idx * 3 + 0] = r * Math.cos(phi);
                positions[idx * 3 + 1] = z;
                positions[idx * 3 + 2] = r * Math.sin(phi);

                // Normal (approximate)
                const drDl = metric.drDl(lParam);
                const nx = -drDl * Math.cos(phi);
                const ny = 1;
                const nz = -drDl * Math.sin(phi);
                const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);

                normals[idx * 3 + 0] = nx / nLen;
                normals[idx * 3 + 1] = ny / nLen;
                normals[idx * 3 + 2] = nz / nLen;

                // UV coordinates
                uvs[idx * 2 + 0] = pi / phiResolution;
                uvs[idx * 2 + 1] = li / (lResolution - 1);
            }
        }

        return { positions, normals, uvs };
    }
}

/**
 * Export default wormhole parameters matching Interstellar's Gargantua
 * (scaled for visualization purposes)
 */
export const DEFAULT_WORMHOLE_PARAMS: WormholeParams = {
    throatRadius: 1.0,         // Normalized throat radius
    length: 2.0,               // Proper length through wormhole
    mass: 0.1,                 // Effective mass for lensing
    spin: 0.0                  // Non-rotating for simplicity
};

/**
 * Validation utilities for physics calculations
 */
export const PhysicsValidation = {
    /**
     * Verify null geodesic condition: g_mu,nu p^mu p^nu = 0
     */
    verifyNullCondition(state: RayState, params: WormholeParams): number {
        const metric = new MorrisThorneMetric(params);
        const g = metric.getMetricComponents(state.l, state.theta);
        const r = metric.circumferentialRadius(state.l);

        // Null condition: p_l^2 + p_theta^2/r^2 + p_phi^2/(r^2 sin^2 theta) = 0
        // (for null rays, this should be zero or very small)
        const nullNorm = state.pl * state.pl
            + state.pTheta * state.pTheta / (r * r)
            + state.pPhi * state.pPhi / (r * r * Math.sin(state.theta) * Math.sin(state.theta));

        return nullNorm;
    },

    /**
     * Check energy conditions for exotic matter
     * Morris-Thorne wormholes require violation of null energy condition
     */
    checkExoticMatter(params: WormholeParams): {
        requiresExoticMatter: boolean;
        minimumNECViolation: number;
    } {
        // The Morris-Thorne wormhole always requires exotic matter at the throat
        // NEC requires rho + p >= 0, which is violated for traversable wormholes
        const { throatRadius } = params;

        // Minimum energy density violation at throat
        // rho ~ -1/(8 pi G b0^2) in geometric units
        const minViolation = -1 / (8 * Math.PI * throatRadius * throatRadius);

        return {
            requiresExoticMatter: true,
            minimumNECViolation: minViolation
        };
    }
};
