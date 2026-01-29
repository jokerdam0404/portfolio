# Physics-Accurate Wormhole Visualization

## Overview

This module implements a scientifically rigorous wormhole visualization based on general relativity. The physics calculations follow the methodology developed by Kip Thorne and the Double Negative visual effects team for the movie Interstellar.

## Scientific References

### Primary Sources

1. **Morris, M.S. & Thorne, K.S. (1988)**
   - "Wormholes in spacetime and their use for interstellar travel: A tool for teaching general relativity"
   - American Journal of Physics, 56(5), 395-412
   - *Establishes the Morris-Thorne traversable wormhole metric*

2. **James, O., von Tunzelmann, E., Franklin, P., & Thorne, K.S. (2015)**
   - "Visualizing Interstellar's Wormhole"
   - American Journal of Physics, 83, 486
   - arXiv:1502.03809
   - *Describes the ray-tracing methodology used in this implementation*

3. **James, O., von Tunzelmann, E., Franklin, P., & Thorne, K.S. (2015)**
   - "Gravitational Lensing by Spinning Black Holes in Astrophysics, and in the Movie Interstellar"
   - Classical and Quantum Gravity, 32(6), 065001
   - arXiv:1502.03808
   - *Covers gravitational lensing calculations*

## Mathematical Framework

### Morris-Thorne Wormhole Metric

The metric describes spacetime geometry in terms of proper radial distance `l`:

```
ds² = -c²dt² + dl² + r(l)²(dθ² + sin²θ dφ²)
```

where:
- `l` = proper radial distance (l = 0 at throat)
- `r(l) = √(b₀² + l²)` = circumferential radius
- `b₀` = throat radius (minimum radius)
- `θ` = polar angle [0, π]
- `φ` = azimuthal angle [0, 2π]

### Metric Properties

**At the throat (l = 0):**
- Minimum radius: r(0) = b₀
- No event horizon (traversable wormhole)
- Maximum curvature

**Far from throat (|l| >> b₀):**
- r(l) ≈ |l| (approaches flat space)
- Metric becomes Minkowski

### Christoffel Symbols

The non-zero connection coefficients for this metric are:

```
Γˡ_θθ = -r(dr/dl) = -l
Γˡ_φφ = -r sin²θ (dr/dl) = -l sin²θ
Γᶿ_lθ = Γᶿ_θl = (dr/dl)/r = l/(b₀² + l²)
Γᶿ_φφ = -sin θ cos θ
Γᵠ_lφ = Γᵠ_φl = (dr/dl)/r = l/(b₀² + l²)
Γᵠ_θφ = Γᵠ_φθ = cot θ
```

### Geodesic Equation

Light rays follow null geodesics:

```
d²xᵘ/dλ² + Γᵘ_αβ (dxᵅ/dλ)(dxᵝ/dλ) = 0
```

where λ is an affine parameter along the ray.

### Conservation Laws

Due to the metric symmetries:
- **Time translation symmetry** → Energy E is conserved
- **Axial symmetry (φ)** → Angular momentum L_z is conserved

## Implementation Details

### Ray Tracing Algorithm

1. **Initialize ray** at camera position with direction toward scene
2. **Convert** to wormhole coordinates (l, θ, φ) and momenta (p_l, p_θ, p_φ)
3. **Integrate** geodesic equation using 4th-order Runge-Kutta
4. **Adaptive stepping** based on local curvature (smaller steps near throat)
5. **Terminate** when ray escapes to large distance
6. **Map** final direction to celestial sphere texture

### Numerical Integration (RK4)

```
k₁ = f(yₙ)
k₂ = f(yₙ + h·k₁/2)
k₃ = f(yₙ + h·k₂/2)
k₄ = f(yₙ + h·k₃)
yₙ₊₁ = yₙ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)
```

This provides O(h⁴) accuracy.

### Adaptive Step Size

Step size scales with local geometry:
```
dt = dt_base × min(1, r/b₀) × sin(θ)
```

This ensures accuracy near the throat and polar axis.

## Physical Effects Implemented

### 1. Gravitational Lensing

Light bending causes:
- **Multiple images** of background objects
- **Einstein rings** when source, lens, observer align
- **Image distortion** and magnification

Deflection angle (weak field):
```
δφ ≈ 4GM/(c²b)
```

### 2. Einstein Ring

When a light source is directly behind the wormhole:
```
θ_E = √(4GM·D_LS / (c²·D_L·D_S))
```

### 3. Gravitational Redshift

Photons climbing out of gravitational well lose energy:
```
z = √(1 - r_s/r) - 1
```

### 4. Doppler Beaming (Accretion Disk)

For rotating accretion disk:
- Approaching side: blueshifted, brightened
- Receding side: redshifted, dimmed

Beaming factor: `(1 + β cos θ)³`

## Energy Conditions

### Exotic Matter Requirement

Morris-Thorne wormholes require matter violating the Null Energy Condition:
```
T_μν k^μ k^ν < 0  for some null vector k^μ
```

At the throat:
```
ρ = -1/(8πG b₀²)
```

This negative energy density prevents gravitational collapse.

### Flare-Out Condition

At the throat, the shape function must satisfy:
```
b'(r₀) < 1
```

This ensures the wormhole "flares out" rather than pinching off.

## Performance Optimizations

### GPU Acceleration

- Ray tracing performed in fragment shader
- Parallel processing of all pixels
- Christoffel symbols computed analytically (faster than LUT for simple metrics)

### Adaptive Quality

| Quality | Max Steps | Step Size | Effects |
|---------|-----------|-----------|---------|
| Low     | 100       | 0.1       | Basic   |
| Medium  | 150       | 0.075     | + Disk  |
| High    | 200       | 0.05      | Full    |

### Precomputation

- Christoffel symbol lookup tables (optional)
- Embedding diagram mesh generation
- Background star field textures

## Validation

### Sanity Checks

1. **Null condition**: g_μν p^μ p^ν ≈ 0 along geodesic
2. **Conservation**: L_z constant along geodesic
3. **Asymptotic flatness**: Metric → Minkowski as r → ∞
4. **Throat crossing**: l changes sign when passing through

### Known Limitations

1. **Schwarzschild comparison**: Our metric differs from Schwarzschild (no horizon)
2. **Spin parameter**: Simplified Kerr-like extension, not exact Kerr-wormhole
3. **Exotic matter**: Not dynamically simulated, assumed present

## File Structure

```
physics/
├── PhysicsEngine.ts       # Core physics calculations
├── PhysicsWormhole.tsx    # React/Three.js component
├── PhysicsControls.tsx    # Interactive parameter controls
├── EquationDisplay.tsx    # Live equation visualization
├── index.ts               # Module exports
├── shaders/
│   └── wormholeRayTracer.glsl  # GPU shader
└── PHYSICS_DOCUMENTATION.md    # This file
```

## Usage Example

```tsx
import { PhysicsWormholeScene } from '@/components/3d/PhysicsWormholeScene';

function MyPage() {
  return (
    <PhysicsWormholeScene
      enableControls={true}
      showPhysicsPanel={true}
      showEquations={true}
      initialParams={{
        throatRadius: 1.0,
        length: 2.0,
        mass: 0.1,
        spin: 0.0
      }}
    />
  );
}
```

## Future Enhancements

1. **Kerr wormhole**: Full rotating wormhole metric
2. **Dynamic exotic matter**: Time-varying throat radius
3. **Gravitational waves**: Perturbations to metric
4. **Multiple wormholes**: Network topology
5. **Quantum corrections**: Semiclassical effects near throat

## Educational Value

This implementation can serve as a teaching tool for:
- General relativity concepts
- Geodesic motion in curved spacetime
- Gravitational lensing phenomena
- Numerical methods in physics
- GPU programming for scientific visualization

---

*"The laws of physics, properly understood, suggest that time travel within the realm of Einstein's general relativity is possible."* — Kip Thorne
