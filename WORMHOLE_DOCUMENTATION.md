# WebGL Wormhole Implementation Documentation

## Overview

A comprehensive, photorealistic 3D wormhole visualization system built with Three.js and React Three Fiber. This implementation features physics-accurate gravitational lensing, particle systems, and performance optimizations for production use.

---

## 🌌 Features

### 1. **Photorealistic Wormhole with Gravitational Lensing**
- Custom GLSL shaders simulating Einstein's general relativity
- Schwarzschild metric approximation for light bending
- Time-varying distortion fields
- Accretion disk with volumetric glow
- Event horizon visualization

### 2. **Advanced Particle Systems**
- **Cosmic Particles**: 5000+ particles with gravitational attraction
- **Energy Particles**: High-speed particles near event horizon
- **Starfield**: Distant stars for depth perception
- GPU-accelerated rendering with BufferGeometry
- Physics-based orbital mechanics

### 3. **Gravitational Physics**
- Inverse square law for gravitational forces
- Orbital velocity calculations
- Particle absorption at event horizon
- Chromatic aberration from spacetime curvature
- Einstein ring effects

### 4. **Performance Optimizations**
- **Adaptive Quality System**: Auto-detects device capability
- **LOD (Level of Detail)**: Adjusts particle counts based on performance
- **Mobile Optimization**: Reduced counts and simplified shaders
- **Performance Monitoring**: Real-time FPS and memory tracking
- **Lazy Loading**: Dynamic imports for code splitting
- **Reduced Motion Support**: Accessible fallback rendering

### 5. **Integration Features**
- Scroll-driven animations
- Smooth scene transitions
- Parallax text overlays
- Responsive design
- Dark theme integration

---

## 📁 Component Architecture

```
components/3d/
├── Wormhole.tsx                    # Main wormhole with shaders
├── CosmicParticles.tsx             # Particle systems (cosmic, energy, stars)
├── GravitationalLensing.tsx        # Advanced lensing effects
├── WormholeScene.tsx               # Complete scene with optimizations
├── PerformanceMonitor.tsx          # Performance tracking and adaptive quality
├── Scene.tsx                       # Base Three.js scene setup
└── Effects.tsx                     # Post-processing effects

components/sections/
└── WormholeHero.tsx                # Hero section with wormhole integration
```

---

## 🚀 Usage

### Basic Integration

```tsx
import WormholeScene from '@/components/3d/WormholeScene';

export default function MyPage() {
  return (
    <div className="h-screen">
      <WormholeScene
        scrollProgress={0.5}
        performance="auto"
        enableControls={false}
      />
    </div>
  );
}
```

### Hero Section Integration

```tsx
import WormholeHero from '@/components/sections/WormholeHero';

export default function Home() {
  return (
    <main>
      <WormholeHero />
      {/* Rest of your content */}
    </main>
  );
}
```

### Advanced: Custom Composition

```tsx
import { Canvas } from '@react-three/fiber';
import Wormhole from '@/components/3d/Wormhole';
import CosmicParticles from '@/components/3d/CosmicParticles';
import { PerformanceMonitor } from '@/components/3d/PerformanceMonitor';

export default function CustomScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} />

      <Wormhole intensity={1.0} scrollProgress={0} />
      <CosmicParticles count={3000} />

      <PerformanceMonitor targetFPS={30} />
    </Canvas>
  );
}
```

---

## ⚙️ Configuration

### Performance Levels

```tsx
<WormholeScene performance="high" />
```

| Level | Cosmic Particles | Energy Particles | Stars | Antialiasing | Post-FX |
|-------|-----------------|------------------|-------|--------------|---------|
| Low   | 1000           | 200              | 500   | ❌           | ❌      |
| Medium| 3000           | 500              | 1000  | ❌           | ❌      |
| High  | 5000           | 1000             | 2000  | ✅           | ✅      |

### Auto Quality Detection

The system automatically detects:
- Mobile vs Desktop
- GPU capability (integrated vs discrete)
- Memory constraints
- Current FPS performance

### Manual Quality Override

```tsx
<WormholeScene
  performance="medium"  // Force medium quality
/>
```

---

## 🎨 Customization

### Wormhole Colors

Edit `Wormhole.tsx`:

```tsx
const tunnelShader = useMemo(
  () => ({
    uniforms: {
      color1: { value: new Color('#1a0a3e') }, // Deep space
      color2: { value: new Color('#4a148c') }, // Intense purple
      color3: { value: new Color('#D4AF37') }, // Gold accent
    },
    // ...
  }),
  []
);
```

### Particle Colors

Edit `CosmicParticles.tsx`:

```tsx
const color1 = new THREE.Color('#D4AF37'); // Gold
const color2 = new THREE.Color('#8b5cf6'); // Purple
const color3 = new THREE.Color('#ffffff'); // White
```

### Animation Speed

Adjust rotation speeds in `useFrame` callbacks:

```tsx
useFrame((state) => {
  if (tunnelRef.current) {
    tunnelRef.current.rotation.z = state.clock.elapsedTime * 0.05; // Slower
  }
});
```

---

## 🔬 Physics Implementation

### Gravitational Force

Implements inverse square law:

```glsl
// Gravitational attraction
const gravitationalForce = 0.5 / (distance² + 1);
```

### Orbital Mechanics

```tsx
// Orbital velocity perpendicular to radial direction
const orbitalSpeed = 0.02 / (distance + 1);
velocities[i3] += -y * orbitalSpeed;
velocities[i3 + 1] += x * orbitalSpeed;
```

### Schwarzschild Metric

Approximates light bending around massive objects:

```glsl
// Deflection angle: α = 2rs/b
float deflectionAngle = (2.0 * schwarzschildRadius) / impactParam;
```

---

## 📊 Performance Monitoring

### Real-time Stats

```tsx
import { PerformanceHUD } from '@/components/3d/PerformanceMonitor';

<Canvas>
  {/* Your scene */}
  {process.env.NODE_ENV === 'development' && <PerformanceHUD />}
</Canvas>
```

Displays:
- **FPS**: Frames per second (color-coded)
- **Frame Time**: Milliseconds per frame
- **Draw Calls**: Number of render calls
- **Triangles**: Triangle count
- **Memory**: Heap usage (if available)

### Adaptive Quality

```tsx
import { useAdaptiveQuality } from '@/components/3d/PerformanceMonitor';

const { quality, onDegrade } = useAdaptiveQuality('high');

<WormholeScene performance={quality} />
<PerformanceMonitor onDegradePerformance={onDegrade} />
```

---

## 🎯 Optimization Tips

### 1. Reduce Particle Count on Mobile

```tsx
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
const particleCount = isMobile ? 1000 : 5000;

<CosmicParticles count={particleCount} />
```

### 2. Lazy Load Heavy Components

```tsx
const WormholeScene = dynamic(() => import('@/components/3d/WormholeScene'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### 3. Limit Post-Processing

Only use effects on high-end devices:

```tsx
{qualityLevel === 'high' && <Effects />}
```

### 4. Use BufferGeometry

All particle systems use BufferGeometry for optimal performance:

```tsx
const positions = new Float32Array(count * 3);
// Direct buffer manipulation is faster than creating Mesh objects
```

---

## 🔧 Troubleshooting

### Low FPS on Good Hardware

1. Check if post-processing is too heavy
2. Reduce particle counts
3. Disable antialiasing: `antialias: false`
4. Lower DPR: `dpr={1}`

### Particles Not Visible

1. Check camera position
2. Verify particle positions are in view frustum
3. Check if `AdaptiveBlending` is supported

### Memory Leaks

1. Ensure geometries/materials are disposed
2. Check for event listener cleanup
3. Use React strict mode to catch issues

### Black Screen

1. Verify WebGL is supported: `gl.getParameter(gl.VERSION)`
2. Check browser console for errors
3. Ensure scene has lighting
4. Verify camera position and target

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Mobile  | All     | ⚠️ Reduced |

**WebGL 2.0 Required** for optimal performance.

---

## 📚 Technical Details

### Shader Techniques

1. **Simplex Noise**: Procedural turbulence generation
2. **Fresnel Effect**: Edge glow using view-dependent lighting
3. **Radial Gradients**: Depth perception in 2D space
4. **Spiral Distortion**: Time-based UV manipulation
5. **Chromatic Aberration**: RGB channel separation

### Particle System Architecture

- **Position Buffer**: Float32Array for XYZ coordinates
- **Velocity Buffer**: Float32Array for motion vectors
- **Color Buffer**: Float32Array for RGB values
- **Size Buffer**: Float32Array for point sizes

### Render Pipeline

```
Scene Setup → Geometry Creation → Shader Compilation →
→ Frame Update → Particle Physics → Render Call → Post-Processing
```

---

## 🚢 Deployment Checklist

- [ ] Test on mobile devices
- [ ] Verify performance on low-end hardware
- [ ] Enable production optimizations
- [ ] Remove debug HUD
- [ ] Test with reduced motion preferences
- [ ] Verify lazy loading works
- [ ] Check bundle size impact
- [ ] Test scroll performance
- [ ] Validate WebGL fallbacks

---

## 📄 License & Credits

### Technologies Used
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and abstractions
- **@react-three/postprocessing**: Post-processing effects
- **Framer Motion**: Scroll animations

### Physics References
- Einstein's General Relativity (1915)
- Schwarzschild Metric (1916)
- Gravitational Lensing Theory

---

## 🎓 Learning Resources

1. **Three.js Journey** - Bruno Simon
2. **WebGL Fundamentals** - Gregg Tavares
3. **The Book of Shaders** - Patricio Gonzalez Vivo
4. **React Three Fiber Docs** - Poimandres

---

## 🤝 Contributing

To add new features:

1. Create new shader in `Wormhole.tsx`
2. Add particle type in `CosmicParticles.tsx`
3. Update quality levels in `WormholeScene.tsx`
4. Document changes in this file
5. Test performance impact

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Enable PerformanceHUD in dev mode
- Review this documentation
- Check Three.js documentation
- Review React Three Fiber docs

---

**Built with ❤️ and lots of physics**
