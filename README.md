# Finance-Focused Personal Portfolio Website

A cutting-edge, highly interactive personal portfolio website showcasing your finance journey, built with Next.js 15, TypeScript, Tailwind CSS, React Three Fiber, and Framer Motion.

## Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript
- **Cinematic 3D Hero**: Scroll-driven journey through stairs → black hole → trading floor
- **Premium Typography**: Space Grotesk (display) + Inter (body) + JetBrains Mono (numeric)
- **Token-Based Theming**: CSS variables for easy customization of colors, spacing, and effects
- **Stunning Animations**: React Three Fiber, Framer Motion & GSAP for professional effects
- **Finance-Optimized Design**: Professional color scheme suitable for IB/PE/HF applications
- **Fully Responsive**: Mobile-first design with optimizations for all devices
- **Easy Content Management**: All content in separate data files for easy updates
- **SEO Optimized**: Built-in metadata and Open Graph tags
- **Accessibility**: Reduced motion support, keyboard navigation, proper focus states

## Sections

1. **Hero** - Cinematic 3D scroll-driven experience with three scenes:
   - Scene A: Walking up stairs (ascent/ambition)
   - Scene B: Black hole warp tunnel (transition/transformation)
   - Scene C: Trading floor emergence (arrival/success)
2. **About** - Professional introduction with skills overview
3. **Finance Journey** - Interactive timeline of your learning path
4. **Projects** - Grid of finance projects with filtering
5. **Experience** - Professional work experience
6. **Skills** - Animated skill bars by category
7. **Education** - Academic background and certifications
8. **Contact** - Social links, contact form, and resume download

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd finance-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization Guide

### Theme Tokens (Colors, Typography, Spacing)

The theme system uses CSS variables defined in `app/globals.css`. Edit these to customize the entire site:

```css
:root {
  /* Background colors */
  --bg: 250 250 252;           /* Main background */
  --bg-deep: 240 242 247;       /* Alternating section background */
  --surface: 255 255 255;       /* Card surfaces */

  /* Text colors */
  --text: 15 23 42;             /* Primary text */
  --text-secondary: 71 85 105;  /* Secondary text */
  --text-muted: 148 163 184;    /* Muted text */

  /* Accent colors */
  --accent: 59 130 246;         /* Primary accent (blue) */
  --accent2: 16 185 129;        /* Secondary accent (emerald) */

  /* Effects */
  --glow: 59 130 246;           /* Glow color for focus states */
}

.dark {
  /* Dark mode overrides... */
}
```

### Typography

Fonts are loaded in `app/layout.tsx` using `next/font/google`:

- **Display Font** (Space Grotesk): Used for headings, hero text
- **Body Font** (Inter): Used for body text, paragraphs
- **Mono Font** (JetBrains Mono): Used for code, numbers

To change fonts:
1. Edit `app/layout.tsx` to import different fonts from `next/font/google`
2. Update CSS variables `--font-display`, `--font-body`, `--font-mono` in `globals.css`

### Hero Timeline & 3D Scene

The cinematic hero is in `components/hero/`:

```
components/hero/
├── CinematicHero.tsx    # Main wrapper with scroll logic
├── CinematicCanvas.tsx  # 3D canvas with all three scenes
├── HeroOverlay.tsx      # Text content overlay
└── index.ts             # Exports
```

**To adjust scroll timing:**
Edit `CinematicHero.tsx`:
- Scene duration is based on 3x viewport height of scrolling
- Modify `heroHeight` calculation to change total scroll length

**To adjust camera movement:**
Edit `CinematicCanvas.tsx` in the `CinematicScene` component:
- `pos1`, `pos2`, `pos3`: Camera positions for each scene
- `lookAt1`, `lookAt2`, `lookAt3`: Camera look-at targets
- `baseFov`, `tunnelFov`: Field of view values

**To adjust scene content:**
Each scene is a separate component in `CinematicCanvas.tsx`:
- `StairsScene`: Stairs geometry, walking figure, particles
- `BlackHoleScene`: Tunnel particles, accretion disk, light beams
- `TradingFloorScene`: Monitor walls, desks, ticker tape

### Postprocessing Effects

Effects are configured in `CinematicCanvas.tsx`:
```tsx
<EffectComposer>
  <Bloom intensity={0.5} luminanceThreshold={0.6} />
  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={3} />
  <Vignette offset={0.1} darkness={0.5} />
  <Noise opacity={0.015} />
</EffectComposer>
```

Adjust values to change the visual feel. Remove effects for better performance on low-end devices.

### Replacing 3D Assets

**To use custom 3D models:**

1. Add GLTF/GLB files to `public/models/`
2. Use `@react-three/drei`'s `useGLTF` hook:
```tsx
import { useGLTF } from '@react-three/drei';

function CustomModel() {
  const { scene } = useGLTF('/models/your-model.glb');
  return <primitive object={scene} />;
}
```

**To optimize 3D assets:**
```bash
# Install gltf-transform CLI
npm install -g @gltf-transform/cli

# Compress with Draco
gltf-transform draco input.glb output.glb

# Or with Meshopt
gltf-transform meshopt input.glb output.glb
```

### Content Data Files

All content is in `lib/data/` - edit the TypeScript objects:

- `journey.ts` - Finance journey milestones
- `projects.ts` - Portfolio projects
- `experience.ts` - Work experience
- `skills.ts` - Skills by category
- `education.ts` - Education and certifications

### Contact Information

Edit `components/sections/Contact.tsx`:
- Line 32: Update email
- Line 47: Update LinkedIn URL
- Line 54: Update GitHub URL

The H-1B1 badge in the hero and contact sections links to the DOL H-1B1 information page.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy
5. Your site will be live at `https://your-project.vercel.app`

## Project Structure

```
finance-portfolio/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Home page
│   └── globals.css          # Theme tokens & global styles
├── components/
│   ├── hero/                # Cinematic 3D hero
│   │   ├── CinematicHero.tsx
│   │   ├── CinematicCanvas.tsx
│   │   └── HeroOverlay.tsx
│   ├── sections/            # Page sections
│   │   ├── Hero.tsx         # Hero wrapper
│   │   ├── About.tsx
│   │   ├── FinanceJourney.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   ├── three/               # Legacy 3D components
│   ├── ui/                  # Reusable UI components
│   └── animations/          # Animation wrappers
├── hooks/                   # Custom React hooks
│   └── usePrefersReducedMotion.ts
├── lib/
│   ├── data/               # Content data files
│   ├── animations.ts       # Animation configurations
│   └── utils.ts            # Utility functions
├── public/
│   ├── images/            # Images
│   └── resume.pdf         # Your resume
├── docs/                   # Documentation
│   ├── CREDITS.md         # Third-party asset credits
│   └── CHANGELOG.md       # Version history
├── tailwind.config.ts     # Tailwind configuration
└── package.json           # Dependencies
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Three Fiber** - 3D graphics
- **@react-three/drei** - R3F helpers
- **@react-three/postprocessing** - Visual effects
- **Framer Motion** - Component animations
- **GSAP** - Advanced animations
- **Space Grotesk / Inter / JetBrains Mono** - Premium typography

## Performance Considerations

- 3D hero is lazy-loaded with dynamic import
- Mobile devices get reduced particle counts and disabled postprocessing
- Static fallback for `prefers-reduced-motion` users
- Images should be optimized (WebP, <200KB)
- Test with Lighthouse in Chrome DevTools

## Troubleshooting

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear Next.js cache: `rm -rf .next`

### 3D Not Rendering
- Check browser WebGL support
- Verify no console errors related to Three.js
- Test in Chrome/Firefox with hardware acceleration enabled

### Styling Issues
- Ensure Tailwind classes are correct
- Check browser console for errors
- Verify CSS variable names match

## License

This project is open source and available for personal use.

## Documentation

- See `docs/CREDITS.md` for third-party asset attributions
- See `docs/CHANGELOG.md` for version history

---

**Built with passion for finance and technology**
