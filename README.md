# Finance-Focused Personal Portfolio Website

A cutting-edge, highly interactive personal portfolio website showcasing your finance journey, built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript
- **Cinematic Video Hero**: Scroll-driven photoreal video experience (stairs → black hole → trading floor)
- **Premium Typography**: Space Grotesk (display) + Inter (body) + JetBrains Mono (numeric)
- **Token-Based Theming**: CSS variables for easy customization of colors, spacing, and effects
- **Stunning Animations**: Framer Motion & GSAP for professional effects
- **Finance-Optimized Design**: Professional color scheme suitable for IB/PE/HF applications
- **Fully Responsive**: Mobile-first design with optimizations for all devices
- **Hardware-Accelerated Video**: Smooth 60fps scroll-scrubbing via native video decoding
- **Easy Content Management**: All content in separate data files for easy updates
- **SEO Optimized**: Built-in metadata and Open Graph tags
- **Accessibility**: Reduced motion support, keyboard navigation, proper focus states

## Live Demo

🌐 [View Live Site](https://finance-portfolio-ruby.vercel.app/)

## Sections

1. **Hero** - Cinematic video scroll-driven experience with three scenes:
   - Scene A: Walking up stairs (ascent/ambition)
   - Scene B: Black hole warp (transition/transformation)
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

1. Clone and navigate to the project:
```bash
git clone <your-repo-url>
cd finance-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. **Important**: Download video assets (see [docs/ASSET_CHECKLIST.md](docs/ASSET_CHECKLIST.md))
   - Place video files in `public/cinematic/`
   - The hero uses placeholder files by default

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization Guide

### Cinematic Video Hero

The hero uses scroll-scrubbed videos for a photoreal cinematic experience. See [docs/HERO_CINEMATIC.md](docs/HERO_CINEMATIC.md) for detailed customization.

#### Quick Overview

```
components/hero/
├── CinematicVideoHero.tsx   # Main scroll-scrubbed video component
├── HeroOverlay.tsx          # Text overlays (name, CTAs, H-1B1 badge)
└── index.ts                 # Exports

public/cinematic/
├── stairs.mp4               # Scene A: Walking up stairs
├── stairs-poster.jpg        # Poster for Scene A
├── blackhole.mp4            # Scene B: Wormhole/black hole
├── blackhole-poster.jpg     # Poster for Scene B
├── trading.mp4              # Scene C: Trading floor
└── trading-poster.jpg       # Poster for Scene C
```

#### Replacing Videos

1. Download new video from Pexels/Pixabay/Mixkit (see [docs/ASSET_CHECKLIST.md](docs/ASSET_CHECKLIST.md))
2. Re-encode for smooth scrubbing:
   ```bash
   ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 \
     -g 15 -keyint_min 15 -sc_threshold 0 -an \
     -vf "scale=1920:1080" public/cinematic/stairs.mp4
   ```
3. Generate poster:
   ```bash
   ffmpeg -i public/cinematic/stairs.mp4 -vframes 1 public/cinematic/stairs-poster.jpg
   ```

### Theme Tokens (Colors, Typography, Spacing)

The theme system uses CSS variables defined in `app/globals.css`:

```css
:root {
  /* Background colors */
  --bg: 250 250 252;
  --surface: 255 255 255;

  /* Text colors */
  --text: 15 23 42;
  --text-secondary: 71 85 105;

  /* Accent colors */
  --accent: 59 130 246;         /* Blue */
  --accent2: 16 185 129;        /* Emerald */
}
```

### Typography

Fonts are loaded in `app/layout.tsx` using `next/font/google`:

- **Display Font** (Space Grotesk): Headings, hero text
- **Body Font** (Inter): Body text, paragraphs
- **Mono Font** (JetBrains Mono): Code, numbers

### Content Data Files

All content is in `lib/data/`:

- `journey.ts` - Finance journey milestones
- `projects.ts` - Portfolio projects
- `experience.ts` - Work experience
- `skills.ts` - Skills by category
- `education.ts` - Education and certifications

### H-1B1 Badge

The H-1B1 badge in the hero links to the official DOL page:
```
https://www.dol.gov/agencies/whd/immigration/h1b1
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy
5. Your site will be live at `https://your-project.vercel.app`

**Note**: Make sure your Vercel project is connected to the correct GitHub repo and branch.

## Project Structure

```
finance-portfolio/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Home page
│   └── globals.css          # Theme tokens & global styles
├── components/
│   ├── hero/                # Video hero system
│   │   ├── CinematicVideoHero.tsx
│   │   └── HeroOverlay.tsx
│   ├── sections/            # Page sections
│   ├── ui/                  # Reusable UI components
│   └── animations/          # Animation wrappers
├── public/
│   ├── cinematic/           # Hero video assets
│   ├── images/              # Static images
│   └── resume.pdf           # Resume file
├── docs/
│   ├── ASSET_CHECKLIST.md   # Video asset requirements
│   ├── HERO_CINEMATIC.md    # Hero technical docs
│   ├── CREDITS.md           # Third-party attributions
│   └── CHANGELOG.md         # Version history
├── lib/data/                # Content data files
├── hooks/                   # Custom React hooks
└── tailwind.config.ts       # Tailwind configuration
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Component animations
- **GSAP** - Scroll animations
- **Space Grotesk / Inter / JetBrains Mono** - Premium typography

## Performance

The video-based hero provides excellent performance:

- **Hardware-accelerated video decoding** - Uses GPU, not CPU
- **RAF-based scroll handling** - No React state updates per frame
- **Lazy loading** - Hero loads dynamically
- **Reduced motion support** - Static fallback for accessibility
- **~12-23 MB video assets** - Reasonable for high-quality cinematics

Target metrics:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- 60fps during scroll

## Troubleshooting

### Videos not loading
- Check files exist in `public/cinematic/`
- Verify file names match exactly (case-sensitive)
- Check browser console for 404 errors

### Scroll feels janky
- Re-encode videos with more keyframes (`-g 15`)
- Reduce video file size
- Test on different browsers

### Build errors
- Run `npm install`
- Check Node.js version (18+)
- Clear cache: `rm -rf .next`

## Documentation

- [docs/HERO_CINEMATIC.md](docs/HERO_CINEMATIC.md) - Hero implementation details
- [docs/ASSET_CHECKLIST.md](docs/ASSET_CHECKLIST.md) - Video asset requirements
- [docs/CREDITS.md](docs/CREDITS.md) - Third-party attributions
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Version history

## License

This project is open source and available for personal use.

---

**Built with passion for finance and technology**
