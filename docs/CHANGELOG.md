# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0] - 2026-01-22

### Major Visual Overhaul & Cinematic 3D Hero

This release introduces a completely redesigned visual identity with premium typography, token-based theming, and an immersive scroll-driven 3D hero experience.

### Added

#### Cinematic 3D Hero Experience
- **New scroll-driven narrative** through three cinematic scenes:
  - Scene A: Person walking up stairs (representing ascent/ambition)
  - Scene B: Black hole warp transition (transformation/leap)
  - Scene C: Trading floor emergence (arrival/success in finance)
- **Postprocessing effects** via `@react-three/postprocessing`:
  - Bloom for glowing elements
  - Depth of Field for cinematic focus
  - Vignette for theatrical framing
  - Subtle film grain noise
- **"Skip Intro" button** with ESC keyboard shortcut
- **Scene progress indicator** on the left side (desktop)
- **Scroll indicator** at the bottom during intro
- Mobile optimizations (reduced particles, disabled postprocessing)
- Static fallback for `prefers-reduced-motion` users

#### Premium Theme System
- **Token-based CSS variable system** for easy customization:
  - Background tokens: `--bg`, `--bg-deep`, `--surface`
  - Text tokens: `--text`, `--text-secondary`, `--text-muted`
  - Accent tokens: `--accent`, `--accent2`, `--accent-hover`
  - Effect tokens: `--glow`, `--shadow-*`
  - Spacing and radius tokens
- **Dark mode** fully supported with semantic color switching
- **Comprehensive shadow system** with premium depth effects
- **Noise overlay utility** for subtle texture

#### Premium Typography
- **Space Grotesk** - Modern geometric display font for headings
- **Inter** - Highly readable body font
- **JetBrains Mono** - Clean monospace for code/numbers
- Custom typography scale with responsive `clamp()` sizing
- Tabular numbers class for financial data
- Proper letter-spacing for each hierarchy level

#### H-1B1 Link Enhancement
- "H-1B1 eligible (Singapore citizen)" text is now a clickable link
- Opens official DOL H-1B1 page in new tab
- Proper `rel="noopener noreferrer"` for security
- Styled with subtle underline animation and hover glow
- External link icon indicator
- Updated in both Hero and Contact sections

#### New Components
- `components/hero/CinematicHero.tsx` - Main hero wrapper
- `components/hero/CinematicCanvas.tsx` - 3D canvas with all scenes
- `components/hero/HeroOverlay.tsx` - Text content overlay

#### New CSS Utilities
- `.card-premium` - Premium card styling with hover effects
- `.glass` - Enhanced glass morphism
- `.link-premium` - Animated link styling
- `.badge-premium` - Premium badge styling
- `.hover-lift` - Hover animation utility
- `.hover-shine` - Shine effect on hover
- `.border-highlight` - Gradient border highlight
- `.noise-overlay` - Subtle texture overlay
- `.gradient-hero` - Hero gradient background

#### Documentation
- `docs/CREDITS.md` - Third-party asset attributions
- `docs/CHANGELOG.md` - Version history (this file)
- Updated `README.md` with comprehensive customization guide

### Changed

- **Hero section** completely rebuilt with cinematic 3D experience
- **Typography** changed from Geist to Space Grotesk + Inter + JetBrains Mono
- **tailwind.config.ts** expanded with:
  - Theme color tokens
  - Custom font families
  - Custom font sizes
  - Premium shadows
  - New animations
  - Custom transitions
- **globals.css** rewritten with comprehensive token system
- **layout.tsx** updated with new font imports
- Build output optimized for new components

### Removed

- Old `HeroCanvas.tsx` and `HeroScene.tsx` (replaced by cinematic system)
- Geist font dependency (replaced with Google Fonts)

### Technical Details

#### Dependencies Added
- `@react-three/postprocessing` - Visual effects
- `postprocessing` - Effect library

#### Performance Optimizations
- Lazy-loaded 3D hero with dynamic import
- Mobile devices: reduced particle counts, disabled postprocessing
- Lower DPR on mobile (1 vs 1.5)
- Static fallback for reduced motion preference
- Efficient scroll handling with passive event listeners

#### Accessibility
- Skip intro button (keyboard: ESC)
- Reduced motion support with static fallback
- Proper focus states with visible focus rings
- ARIA-compliant link behaviors

---

## [1.0.0] - Initial Release

### Features
- Finance-focused portfolio structure
- 8 sections: Hero, About, Finance Journey, Projects, Experience, Skills, Education, Contact
- Dark/light mode support
- Animated components with Framer Motion and GSAP
- Basic 3D floating orb hero
- Responsive design
- SEO optimized
