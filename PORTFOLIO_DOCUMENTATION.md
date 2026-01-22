# Achintya Chaganti - Portfolio Website Documentation

## Overview

This is a professional portfolio website for **Achintya Chaganti**, a Physics & Economics dual-degree student at Northeastern University and Michigan State University. The site showcases his work as an Equity Analyst managing a $5M mid-cap fund and his research in computational physics.

**Live Site:** Deployed on Vercel
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Three.js

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Key Features](#key-features)
3. [3D Hero Animation](#3d-hero-animation)
4. [Dark Mode](#dark-mode)
5. [Contact Form](#contact-form)
6. [Performance Optimizations](#performance-optimizations)
7. [Customization Guide](#customization-guide)
8. [Development Commands](#development-commands)
9. [Implementation History](#implementation-history)

---

## Project Structure

```
finance-portfolio/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx             # Home page composition
│   └── globals.css          # Global styles + dark mode
│
├── components/
│   ├── animations/
│   │   ├── PageTransition.tsx
│   │   └── ScrollReveal.tsx
│   ├── sections/
│   │   ├── Hero.tsx         # Hero with 3D canvas
│   │   ├── About.tsx        # About with headshot
│   │   ├── Projects.tsx     # Project cards with tilt
│   │   ├── Contact.tsx      # Contact form section
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Skills.tsx
│   │   └── FinanceJourney.tsx
│   ├── three/
│   │   ├── HeroCanvas.tsx   # 3D canvas wrapper (lazy-loaded)
│   │   └── HeroScene.tsx    # 3D scene (orb, particles, rings)
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tilt-card.tsx    # 3D tilt hover effect
│   │   ├── headshot.tsx     # Image with monogram fallback
│   │   ├── theme-toggle.tsx # Dark/light mode toggle
│   │   └── contact-form.tsx # Working contact form
│   ├── Navigation.tsx
│   └── ThemeProvider.tsx
│
├── hooks/
│   └── usePrefersReducedMotion.ts  # Motion + mobile detection
│
├── lib/
│   ├── animations.ts        # Framer Motion variants
│   ├── utils.ts             # Utility functions
│   └── data/                # Content data files
│
└── public/
    └── images/              # Static assets
```

---

## Key Features

### 1. 3D Hero Animation
- Floating glassy orb with orbiting particles
- "Finance x Physics" aesthetic (atom-like orbital pattern)
- Scroll-linked parallax (orb rises as you scroll)
- Dark/light mode color adaptation
- FPS counter in development mode

### 2. Dark Mode Support
- System-aware theme detection
- Smooth toggle animation
- Theme persists across sessions
- All sections adapt colors appropriately

### 3. Micro-Interactions
- 3D tilt hover on project cards
- Scroll-reveal animations on all sections
- Smooth page transitions
- Interactive navigation

### 4. Contact Form
- Working form with Web3Forms integration
- Fallback to mailto if no API key
- Form validation and loading states
- Success/error feedback

### 5. Accessibility
- Respects `prefers-reduced-motion`
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus-visible states

### 6. Performance
- Lazy-loaded 3D bundle
- Mobile optimizations (lower DPR, fewer particles)
- Static site generation
- Optimized images with next/image

---

## 3D Hero Animation

### Architecture

```
HeroCanvas.tsx (wrapper)
├── Lazy loads Canvas from @react-three/fiber
├── Detects reduced-motion preference
├── Tracks scroll progress
├── Provides mobile optimizations
│
└── HeroScene.tsx (3D content)
    ├── Central glassy orb (MeshDistortMaterial)
    ├── Inner glow sphere
    ├── Orbiting particles (3 orbital rings)
    └── Grid rings for depth
```

### Tuning Parameters

Edit `components/three/HeroScene.tsx`:

```tsx
// Animation speed (0.5 = slower, 2 = faster)
speed={1}

// Number of orbiting particles
particleCount={60}  // Desktop
particleCount={30}  // Mobile

// Central orb size
orbSize={2.5}

// Scene scale
scale={1}      // Desktop
scale={0.7}    // Mobile
```

### Color Customization

Colors are defined in `HeroScene.tsx`:

```tsx
const COLORS = {
  light: {
    sphere: "#1E40AF",      // Deep blue
    innerGlow: "#60A5FA",   // Light blue
    ring: "#3B82F6",        // Medium blue
  },
  dark: {
    sphere: "#3B82F6",      // Brighter blue
    innerGlow: "#93C5FD",   // Very light blue
    ring: "#60A5FA",        // Light blue
  },
};
```

### Scroll Parallax

The 3D scene responds to scroll position:
- At scroll 0%: Scene at original position
- At scroll 100%: Scene moves up 3 units, scales to 80%
- Smooth interpolation (lerp factor: 0.1)

---

## Dark Mode

### Implementation

Uses `next-themes` library with class-based strategy:

1. **ThemeProvider** wraps the app in `layout.tsx`
2. **ThemeToggle** component in navigation
3. **CSS classes** in `globals.css` for dark mode styles
4. **3D scene** adapts colors via `isDark` prop

### Adding Dark Mode to New Components

```tsx
// In your component
import { useTheme } from 'next-themes';

function MyComponent() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={isDark ? 'bg-primary-800' : 'bg-white'}>
      {/* content */}
    </div>
  );
}
```

---

## Contact Form

### Setup

The form uses Web3Forms API. To enable:

1. Get a free access key at https://web3forms.com/
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key_here
   ```
3. Form submissions will be sent to your email

### Fallback Behavior

If no API key is configured, the form falls back to opening the user's email client with pre-filled content.

---

## Performance Optimizations

### 3D Bundle
- Canvas and scene are dynamically imported (`ssr: false`)
- Only loads when hero section is visible
- Total 3D bundle: ~150KB (lazy-loaded)

### Mobile Optimizations
```tsx
const mobileConfig = {
  dpr: 1,              // Lower pixel ratio
  particleCount: 30,   // Fewer particles
  scale: 0.7,          // Smaller scene
  antialias: false,    // Disabled for performance
};
```

### Reduced Motion
Users with `prefers-reduced-motion` see a static CSS fallback:
- Gradient orb effect
- Decorative ring borders
- No JavaScript animations

---

## Customization Guide

### Adding Your Headshot

1. Add your image to `/public/images/headshot.jpg`
2. Edit `components/sections/About.tsx`:
   ```tsx
   <Headshot
     src="/images/headshot.jpg"  // Uncomment this line
     alt="Achintya Chaganti"
     size={280}
     initials="AC"
   />
   ```

### Updating Content

Content is stored in `/lib/data/`:
- `projects.ts` - Project cards
- `experience.ts` - Work experience
- `education.ts` - Education history
- `skills.ts` - Skills list
- `journey.ts` - Finance journey timeline

### Changing Colors

Edit `tailwind.config.ts`:
```ts
colors: {
  primary: { /* Navy scale */ },
  accent: { /* Blue scale */ },
  success: { /* Green scale */ },
}
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start
```

---

## Implementation History

### Initial Build
- Next.js 15 + TypeScript + Tailwind CSS
- Framer Motion + GSAP animations
- Section-based layout with scroll navigation

### 3D + Polish Refresh (Session 1)
**Commit:** `db84501`

Added:
- 3D hero animation (react-three-fiber)
- Lazy loading for 3D bundle
- Reduced motion fallback
- Mobile optimizations
- 3D tilt hover on project cards
- Headshot component with monogram fallback
- H-1B1 eligibility badge

### Dark Mode + Forms (Session 2)
**Commit:** (current)

Added:
- Dark mode support (next-themes)
- Theme toggle in navigation
- 3D scene dark mode colors
- Scroll-linked parallax effect
- FPS counter in dev mode
- Contact form with Web3Forms
- Updated contact section layout

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms API key for contact form | No (falls back to mailto) |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL required for 3D effects. Falls back gracefully to CSS for unsupported browsers.

---

## Deployment

The site is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push to `main`

Environment variables should be set in Vercel dashboard.

---

## Future Improvements (Not Yet Implemented)

1. **Project screenshots** - Replace emoji placeholders with actual images
2. **Blog section** - Add MDX-powered blog for articles
3. **Analytics** - Add Vercel Analytics or Plausible
4. **i18n** - Multi-language support
5. **PWA** - Progressive web app capabilities

---

## Credits

- **Framework:** Next.js by Vercel
- **3D Library:** Three.js + React Three Fiber
- **Animations:** Framer Motion + GSAP
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **Font:** Geist by Vercel

---

*Last updated: January 2026*
