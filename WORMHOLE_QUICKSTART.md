# 🚀 Wormhole Quick Start Guide

Get your photorealistic 3D wormhole running in 5 minutes!

---

## ✅ What You Got

A complete WebGL wormhole implementation with:

✨ **Photorealistic Effects**
- Gravitational lensing shaders
- Physics-accurate particle systems
- Real-time gravitational attraction
- Accretion disk and event horizon

⚡ **Performance Optimized**
- Auto-detects device capability
- Adaptive quality (low/medium/high)
- Mobile-optimized
- LOD particle system

🎨 **Production Ready**
- Scroll-driven animations
- Smooth transitions
- Accessible (reduced-motion support)
- TypeScript + React

---

## 🎯 Three Ways to Use It

### Option 1: Replace Your Current Hero (Recommended)

**File: `app/page.tsx`**

```tsx
// Replace this:
import CinematicHero from "@/components/sections/CinematicHero";

// With this:
import WormholeHero from "@/components/sections/WormholeHero";

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#050505]">
        <WormholeHero />  {/* 👈 New! */}
        <MetricsGrid />
        {/* ... rest of your sections */}
      </main>
    </PageTransition>
  );
}
```

✅ **That's it!** You now have a 3D wormhole hero.

---

### Option 2: Add as Background Element

**Any page/component:**

```tsx
import WormholeScene from '@/components/3d/WormholeScene';

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background wormhole */}
      <div className="fixed inset-0 -z-10">
        <WormholeScene performance="auto" />
      </div>

      {/* Your content on top */}
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

---

### Option 3: Custom Integration

```tsx
import { Canvas } from '@react-three/fiber';
import Wormhole from '@/components/3d/Wormhole';
import CosmicParticles from '@/components/3d/CosmicParticles';

export default function Custom() {
  return (
    <div className="h-screen">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} />

        <Wormhole intensity={1.0} />
        <CosmicParticles count={3000} />
      </Canvas>
    </div>
  );
}
```

---

## 🎮 Demo Page

Visit `/wormhole-demo` to see:
- All components in action
- Performance controls
- Quality settings
- Live stats (FPS, memory, draw calls)

**Start dev server:**
```bash
npm run dev
```

Then visit: `http://localhost:3000/wormhole-demo`

---

## ⚙️ Configuration

### Set Quality Level

```tsx
<WormholeScene
  performance="high"    // 'low' | 'medium' | 'high' | 'auto'
/>
```

**Auto** = Automatically detects device and adjusts quality

### Enable Debug Controls

```tsx
<WormholeScene
  enableControls={true}  // Adds orbit controls for testing
/>
```

### Scroll Integration

```tsx
const { scrollYProgress } = useScroll();

<WormholeScene
  scrollProgress={scrollYProgress.get()}  // 0 to 1
/>
```

---

## 📊 Performance Tips

### For Production

```tsx
// app/page.tsx
const WormholeHero = dynamic(
  () => import('@/components/sections/WormholeHero'),
  { ssr: false }  // 👈 Disable SSR for WebGL
);
```

### For Mobile

The system **automatically** reduces quality on mobile:
- Fewer particles (1000 vs 5000)
- No antialiasing
- Simplified shaders
- Lower DPR

**No configuration needed!** ✅

---

## 🎨 Customization

### Change Colors

**File: `components/3d/Wormhole.tsx`**

Find this section (around line 30):

```tsx
uniforms: {
  color1: { value: new Color('#1a0a3e') },  // 👈 Change colors here
  color2: { value: new Color('#4a148c') },
  color3: { value: new Color('#D4AF37') },
}
```

### Change Particle Colors

**File: `components/3d/CosmicParticles.tsx`**

Around line 45:

```tsx
const color1 = new THREE.Color('#D4AF37'); // Gold
const color2 = new THREE.Color('#8b5cf6'); // Purple
const color3 = new THREE.Color('#ffffff'); // White
```

### Adjust Speed

**File: `components/3d/Wormhole.tsx`**

In the `useFrame` hook (around line 200):

```tsx
tunnelRef.current.rotation.z = time * 0.05;  // 👈 Lower = slower
```

---

## 🐛 Troubleshooting

### "Black screen" or nothing renders

**Solution:** Check if WebGL is enabled in your browser.

```tsx
// Add this to see error messages
{process.env.NODE_ENV === 'development' && <PerformanceHUD />}
```

### Low FPS (< 30)

**Solution:** Force lower quality:

```tsx
<WormholeScene performance="low" />
```

### Particles not visible

**Solution:** Adjust camera position or particle distribution in `CosmicParticles.tsx`

### Build errors with Three.js

**Solution:** Make sure components are client-side only:

```tsx
'use client';  // 👈 Add this to top of file
```

---

## 📱 Mobile Optimization

The system is **already optimized** for mobile! It automatically:
- ✅ Detects mobile devices
- ✅ Reduces particle count
- ✅ Simplifies shaders
- ✅ Disables expensive effects
- ✅ Uses lower resolution

**Test on mobile:**
```bash
# On your mobile device, visit:
http://[your-ip]:3000
```

---

## 🚢 Deploy Checklist

Before deploying to production:

- [ ] Test on mobile devices
- [ ] Remove `<PerformanceHUD />` from production code
- [ ] Set `performance="auto"` for adaptive quality
- [ ] Enable `ssr: false` for dynamic imports
- [ ] Test scroll performance
- [ ] Verify bundle size (should add ~200KB gzipped)

---

## 🎓 Next Steps

### 1. Read Full Documentation
See `WORMHOLE_DOCUMENTATION.md` for:
- Complete API reference
- Physics explanations
- Advanced customization
- Shader details

### 2. Explore Components
- `Wormhole.tsx` - Main wormhole with shaders
- `CosmicParticles.tsx` - Particle systems
- `GravitationalLensing.tsx` - Advanced effects
- `WormholeScene.tsx` - Complete scene
- `PerformanceMonitor.tsx` - Performance tools

### 3. Customize!
- Change colors to match your brand
- Adjust animation speeds
- Add your own particle effects
- Experiment with shaders

---

## 💡 Pro Tips

### 1. Performance First
Always use `performance="auto"` for production. Let the system optimize for each device.

### 2. Lazy Load
Use dynamic imports for better initial load times:

```tsx
const WormholeScene = dynamic(() => import('@/components/3d/WormholeScene'), {
  ssr: false
});
```

### 3. Monitor in Dev
Use `<PerformanceHUD />` during development to track FPS and memory.

### 4. Test Scroll
Test scroll performance on real devices. The wormhole responds to scroll position (0-1).

### 5. Accessibility
The system respects `prefers-reduced-motion`. Users who prefer less animation get a static gradient.

---

## 🆘 Get Help

1. **Check the demo:** `/wormhole-demo`
2. **Read docs:** `WORMHOLE_DOCUMENTATION.md`
3. **Enable debug mode:** Add `<PerformanceHUD />`
4. **Check console:** Open browser DevTools
5. **Test quality:** Try different quality settings

---

## 🎉 You're Ready!

Your portfolio now has a **production-ready, photorealistic 3D wormhole** with:
- ✅ Physics-accurate effects
- ✅ Auto-optimized performance
- ✅ Mobile support
- ✅ Accessible
- ✅ Customizable

**Enjoy your cosmic journey!** 🌌✨

---

Built with Three.js, React Three Fiber, and lots of physics ❤️
