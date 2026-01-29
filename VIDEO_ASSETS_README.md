# Video Assets - Space to Wall Street Journey

## 📹 Available Videos

### **Encoded for Web (Ready to Use)**

Located in: `/public/cinematic/journey/encoded/`

1. **space-journey.mp4** (~22MB)
   - Scene: Origins from deep space / Astronaut EVA
   - Duration: Shows the beginning of the journey
   - Use for: ACT I - "From Deep Space"

2. **wormhole-transit.mp4** (~9.3MB)
   - Scene: Cosmic transition through space
   - Duration: The transformation sequence
   - Use for: ACT II - "The Singularity"

3. **wall-street-arrival.mp4** (~6.0MB)
   - Scene: Trading floor arrival
   - Duration: The final destination
   - Use for: ACT III - "To Wall Street"

### **Poster Images (Ready)**

Located in: `/public/cinematic/journey/posters/`

- `space-poster.jpg` (233KB) - First frame from space journey
- `wormhole-poster.jpg` (207KB) - First frame from wormhole transit
- `wallstreet-poster.jpg` (276KB) - First frame from trading floor

### **Raw Videos (Source Material)**

Located in: `/public/cinematic/journey/raw/`

- `astronaut-eva.mp4` (214MB) - Original high-res space footage
- `space-cosmic.mp4` (226MB) - Original cosmic transition
- `trading-floor.mp4` (322MB) - Original trading floor footage

---

## 🎬 How to Use

### **Option 1: CinematicVideoHero (Real Videos)**

The `CinematicVideoHero` component uses the actual video files:

```tsx
import { CinematicVideoHero } from "@/components/hero";

export default function Page() {
  return <CinematicVideoHero />;
}
```

Features:
- Scroll-scrubbed video playback
- Hardware-accelerated H.264 decoding
- Poster images for fast loading
- Three-scene narrative

### **Option 2: SpaceToWallStreetHero (Currently Active)**

The `SpaceToWallStreetHero` component uses 3D wormhole with text overlays:

```tsx
import SpaceToWallStreetHero from "@/components/sections/SpaceToWallStreetHero";

export default function Page() {
  return <SpaceToWallStreetHero />;
}
```

Features:
- 3D wormhole visualization background
- Scroll-driven three-act narrative
- Text overlays with story progression
- Metrics display at finale
- Lower bandwidth (no large video files)

---

## 🔄 Switching Between Heroes

### To Use Video Hero:

Edit `app/page.tsx`:

```tsx
// Replace this:
import SpaceToWallStreetHero from "@/components/sections/SpaceToWallStreetHero";

// With this:
import { CinematicVideoHero } from "@/components/hero";

// And update the component:
<CinematicVideoHero />
```

### To Use Wormhole Hero (Current):

Already active! The current deployment uses `SpaceToWallStreetHero`.

---

## 📊 File Sizes & Performance

| Asset | Size | Load Time (Fast 3G) | Notes |
|-------|------|---------------------|-------|
| space-journey.mp4 | ~22MB | ~30s | Largest file |
| wormhole-transit.mp4 | ~9.3MB | ~13s | Medium size |
| wall-street-arrival.mp4 | ~6.0MB | ~8s | Smallest video |
| All posters combined | ~700KB | <2s | Quick load |

**Total video bandwidth:** ~37MB for full experience

### Recommendations:

- **Current Setup (Wormhole + Text):** Best for performance, works everywhere
- **Video Hero:** Best for high-end experience, requires good connection
- **Hybrid:** Use wormhole on mobile, videos on desktop

---

## 🎯 Current Status

✅ **Active:** SpaceToWallStreetHero (3D wormhole with narrative text)
✅ **Available:** CinematicVideoHero (real video scroll-scrubbing)
✅ **Videos:** Encoded and optimized for web
✅ **Posters:** Generated from video frames
✅ **Performance:** Both options optimized

---

## 🚀 Deployment

**Current deployment** uses SpaceToWallStreetHero which:
- Loads faster (no large video files)
- Works on all devices and connections
- Provides the full three-act Space to Wall Street narrative
- Uses the impressive 3D wormhole visualization

**To deploy with videos:**
1. Switch to CinematicVideoHero in `app/page.tsx`
2. Commit and push changes
3. Vercel will deploy automatically
4. Videos will load progressively as users scroll

---

## 📝 Video Encoding Details

Videos were encoded using FFmpeg with these settings:

```bash
ffmpeg -i input.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -c:v libx264 \
  -preset fast \
  -crf 28 \
  -c:a aac \
  -b:a 128k \
  output.mp4
```

Settings explained:
- **Resolution:** 1920x1080 (1080p)
- **Codec:** H.264 (universal browser support)
- **CRF 28:** Good quality/size balance
- **Preset fast:** Reasonable encoding speed
- **Audio:** AAC 128k (web-optimized)

---

## 🎨 Design Intent

The Space to Wall Street journey visualizes:

**ACT I - Origins:** Astronaut in deep space represents the scientific/physics background

**ACT II - Transformation:** Cosmic wormhole transition represents the journey through learning and transformation

**ACT III - Arrival:** Trading floor represents the destination in finance and Wall Street

This narrative arc mirrors your actual career path from physics student to equity analyst.

---

**Created:** 2026-01-29
**Status:** Production Ready
**Current Hero:** SpaceToWallStreetHero (3D Wormhole)
**Alternative:** CinematicVideoHero (Real Videos)
