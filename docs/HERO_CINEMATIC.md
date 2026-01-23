# Cinematic Video Hero - Technical Documentation

## Overview

The hero section presents a scroll-driven cinematic experience using high-quality video clips. Users scroll through three narrative "acts":

1. **Ascent** - Person walking up stairs (ambition, climbing)
2. **Transit** - Black hole/wormhole fall (transformation, leap of faith)
3. **Arrival** - Trading floor emergence (success, Wall Street)

This approach delivers **photoreal visuals** while maintaining **excellent performance** through hardware-accelerated video decoding.

---

## Architecture

### File Structure

```
components/hero/
├── CinematicVideoHero.tsx   # Main video hero component
├── HeroOverlay.tsx          # Text overlays (H-1B1 badge, name, CTAs)
└── index.ts                 # Exports

public/cinematic/
├── stairs.mp4               # Scene A video
├── stairs-poster.jpg        # Scene A poster (first frame)
├── blackhole.mp4            # Scene B video
├── blackhole-poster.jpg     # Scene B poster
├── trading.mp4              # Scene C video
└── trading-poster.jpg       # Scene C poster
```

### Component Flow

```
Hero.tsx (section wrapper)
  └── CinematicVideoHero.tsx (dynamic import, ssr: false)
        ├── <video> × 3 (stacked, opacity-controlled)
        ├── Cinematic overlays (grain, vignette via CSS)
        └── HeroOverlay.tsx (text content, H-1B1 badge)
```

---

## Technical Approach

### Scroll-Driven Video Scrubbing

Instead of playing videos linearly, we **scrub the currentTime** based on scroll position:

1. Total scroll height: 300vh (3 viewport heights)
2. Each scene occupies ~100vh of scrolling
3. Video `currentTime` is mapped to scroll progress within each scene

```typescript
const progress = scrollY / (viewportHeight * 3);  // 0 to 1
const sceneIndex = Math.floor(progress * 3);       // 0, 1, or 2
const sceneProgress = (progress * 3) % 1;          // 0 to 1 within scene
video.currentTime = sceneProgress * video.duration;
```

### Performance Optimizations

1. **RAF-based updates**: Scroll handling uses `requestAnimationFrame`, not React state per frame
2. **CSS transforms only**: Opacity changes via inline styles, no layout thrashing
3. **Throttled state updates**: Display progress updates at max 30fps for overlay animations
4. **Hardware video decoding**: MP4 H.264 uses GPU acceleration on all modern devices
5. **No WebGL/Three.js**: Removed heavy 3D libraries entirely

### Video Encoding Requirements

For smooth scrubbing, videos need **frequent keyframes**:

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 \
  -g 15 -keyint_min 15 -sc_threshold 0 -an \
  -vf "scale=1920:1080" output.mp4
```

- `-g 15`: Keyframe every 15 frames (~0.5s at 30fps)
- `-sc_threshold 0`: Disable scene-change detection for consistent keyframes
- `-an`: Strip audio (not needed)
- `-crf 22`: Quality level (18-23 recommended)

### Mobile Considerations

- Videos use `playsinline` for iOS compatibility
- `preload="auto"` for faster initial load
- Poster images show during load
- Same scroll-scrub behavior works on touch devices
- Reduced motion: Shows static poster instead

---

## Customization

### Adjusting Scroll Length

In `CinematicVideoHero.tsx`, change the constant:

```typescript
const SCROLL_HEIGHT_VH = 300;  // 3 scenes × 100vh each
```

For a faster experience, use `200` (shorter scroll). For slower, use `400`.

### Adding/Removing Scenes

Edit the `SCENES` array:

```typescript
const SCENES = [
  { id: "stairs", label: "Ascent", video: "/cinematic/stairs.mp4", poster: "/cinematic/stairs-poster.jpg" },
  { id: "blackhole", label: "Transit", video: "/cinematic/blackhole.mp4", poster: "/cinematic/blackhole-poster.jpg" },
  { id: "trading", label: "Arrival", video: "/cinematic/trading.mp4", poster: "/cinematic/trading-poster.jpg" },
];
```

Remember to update `SCROLL_HEIGHT_VH` accordingly (100vh per scene).

### Changing Scene Labels

The scene progress indicator (left side on desktop) uses `scene.label`. Change these in the `SCENES` array.

### Adjusting Crossfades

Scene transitions are controlled in the RAF update loop. Look for:

```typescript
// Fade in next scene starting at 70% through current scene
const fadeProgress = Math.max(0, sceneProgress - 0.7) / 0.3;
```

Change `0.7` to start crossfade earlier/later, and `0.3` for fade duration.

---

## Replacing Video Assets

1. **Download new video** (see `docs/ASSET_CHECKLIST.md` for sources)

2. **Re-encode for scrubbing**:
   ```bash
   ffmpeg -i new-video.mp4 -c:v libx264 -preset slow -crf 22 \
     -g 15 -keyint_min 15 -sc_threshold 0 -an \
     -vf "scale=1920:1080" public/cinematic/stairs.mp4
   ```

3. **Generate poster**:
   ```bash
   ffmpeg -i public/cinematic/stairs.mp4 -vframes 1 -q:v 2 \
     public/cinematic/stairs-poster.jpg
   ```

4. **Test locally**: `npm run dev`

5. **Verify build**: `npm run build`

---

## Text Overlay (HeroOverlay.tsx)

The overlay shows different content based on scroll progress:

| Scroll Progress | Content |
|-----------------|---------|
| 0.00 - 0.33 | Name, H-1B1 badge, typing animation |
| 0.33 - 0.66 | Transition text ("From physics to markets...") |
| 0.66 - 1.00 | CTAs ("View My Work", "Get In Touch") |

### H-1B1 Badge

The badge links to the official DOL page and is located in `HeroOverlay.tsx`:

```tsx
<a
  href="https://www.dol.gov/agencies/whd/immigration/h1b1"
  target="_blank"
  rel="noopener noreferrer"
  // ... styling
>
  H-1B1 eligible (Singapore citizen)
</a>
```

---

## Accessibility

1. **Reduced Motion**: If `prefers-reduced-motion` is enabled, shows static poster with no video scrubbing
2. **Keyboard Navigation**: ESC key skips intro, all buttons are focusable
3. **Focus States**: Visible focus rings on interactive elements
4. **Videos are decorative**: Marked with `aria-hidden="true"`

---

## Troubleshooting

### Videos not scrubbing smoothly

**Cause**: Not enough keyframes in video encoding.

**Solution**: Re-encode with `-g 15 -keyint_min 15` flags.

### Videos not loading

**Check**:
1. Files exist in `public/cinematic/`
2. File names match exactly (case-sensitive)
3. Videos are valid MP4 files
4. Browser console for 404 errors

### Jank/stuttering on scroll

**Possible causes**:
1. Video files too large (reduce quality or resolution)
2. Other heavy animations on page
3. Low-end device

**Solutions**:
- Use `-crf 24` for smaller file size
- Reduce video resolution to 720p for mobile
- Disable grain/vignette overlays

### Mobile Safari issues

Safari requires:
- `playsinline` attribute (already included)
- `muted` attribute (already included)
- User may need to tap once before scrubbing works on some iOS versions

### Build fails

**Check**:
1. TypeScript errors in component
2. Missing poster files (create empty placeholders if needed)
3. Import paths are correct

---

## Performance Metrics

Target performance:

| Metric | Target | Notes |
|--------|--------|-------|
| LCP | < 2.5s | Poster images load first |
| FID | < 100ms | No heavy JS during interaction |
| CLS | < 0.1 | Stable layout, no shifts |
| FPS | 60fps | RAF-based updates |
| Memory | < 150MB | Videos are streamed, not fully buffered |

---

## Future Improvements

1. **WebM fallback**: Add VP9 WebM for better compression on Chrome
2. **Adaptive quality**: Serve 720p on mobile, 1080p on desktop
3. **Intersection Observer**: Pause video loading when not visible
4. **Service Worker caching**: Cache videos for return visits
