# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.1.0] - 2026-01-22

### Complete Hero Overhaul: Video-Based Cinematic

This release completely replaces the WebGL-based 3D hero with a performant, photoreal video-based cinematic experience.

### Changed

#### Hero System
- **Replaced WebGL/Three.js with video-based cinematics**
  - Removed React Three Fiber, drei, postprocessing, and Three.js dependencies
  - New `CinematicVideoHero.tsx` using scroll-scrubbed MP4 videos
  - Hardware-accelerated video decoding instead of CPU-heavy WebGL
  - RAF-based scroll handling for 60fps performance
  - Crossfade transitions between scenes

#### Performance
- **Removed heavy dependencies:**
  - `@react-three/fiber` (removed)
  - `@react-three/drei` (removed)
  - `@react-three/postprocessing` (removed)
  - `three` (removed)
  - `@types/three` (removed)
  - `postprocessing` (removed)
  - `geist` (removed, using Google Fonts)
- **Bundle size significantly reduced**
- **Scroll performance dramatically improved** (no React state updates per frame)

#### Configuration
- Added `engines.node >= 18.0.0` to package.json
- Added `outputFileTracingRoot` to next.config.js to fix lockfile warnings
- Version bumped to 2.0.0

### Added

- `components/hero/CinematicVideoHero.tsx` - New video-based hero
- `public/cinematic/` directory for video assets
- `docs/HERO_CINEMATIC.md` - Detailed technical documentation
- `docs/ASSET_CHECKLIST.md` - Video asset download guide with sources
- Replay button after intro completion
- Placeholder video/poster files for testing

### Removed

- `components/hero/CinematicHero.tsx` (old WebGL version)
- `components/hero/CinematicCanvas.tsx` (old WebGL version)
- `components/three/` directory (legacy 3D components)
- All Three.js and postprocessing dependencies

### Technical Notes

The new video-based approach:
1. Uses three MP4 videos (stairs, blackhole, trading)
2. Scroll position controls video `currentTime` (scrubbing)
3. Scene transitions via opacity crossfades
4. CSS-only film grain and vignette overlays
5. Static poster fallback for `prefers-reduced-motion`

Video encoding requirements:
- Frequent keyframes (`-g 15`) for smooth scrubbing
- H.264 codec for universal hardware decoding
- 1080p resolution, ~4-8MB per clip

---

## [2.0.0] - 2026-01-22

### Major Visual Overhaul & Cinematic 3D Hero

This release introduced a redesigned visual identity with premium typography, token-based theming, and a 3D hero experience.

### Added

#### Premium Theme System
- Token-based CSS variable system
- Dark mode support
- Premium shadows and effects

#### Typography
- Space Grotesk (display font)
- Inter (body font)
- JetBrains Mono (mono font)

#### 3D Hero (now replaced in 2.1.0)
- Scroll-driven Three.js experience
- Postprocessing effects
- Skip intro button

#### H-1B1 Link
- Badge links to official DOL page
- Updated in both Hero and Contact sections

---

## [1.0.0] - Initial Release

### Features
- Finance-focused portfolio structure
- 8 sections: Hero, About, Finance Journey, Projects, Experience, Skills, Education, Contact
- Dark/light mode support
- Animated components with Framer Motion and GSAP
- Responsive design
- SEO optimized
