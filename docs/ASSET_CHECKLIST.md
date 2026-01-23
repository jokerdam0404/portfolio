# Asset Checklist for Cinematic Video Hero

This document lists all video and image assets needed for the cinematic hero experience.

## Quick Setup

1. Download the videos listed below
2. Place them in `/public/cinematic/`
3. Generate poster images from the first frame of each video
4. Run `npm run build` to verify

---

## Required Files

| File | Type | Description |
|------|------|-------------|
| `stairs.mp4` | Video | Person walking up stairs |
| `stairs-poster.jpg` | Image | First frame of stairs video (1920x1080) |
| `blackhole.mp4` | Video | Black hole / wormhole tunnel |
| `blackhole-poster.jpg` | Image | First frame of blackhole video (1920x1080) |
| `trading.mp4` | Video | Trading floor with screens |
| `trading-poster.jpg` | Image | First frame of trading video (1920x1080) |

---

## Scene A: Stairs (Ascending)

**Narrative**: A person (preferably in business attire) walking up stairs, representing ambition and climbing to success.

### Search Terms
- "businessman walking up stairs cinematic"
- "man walking upstairs slow motion suit"
- "person climbing stairs close up feet"
- "corporate walking stairs backlit"
- "ascending staircase cinematic footage"

### Candidate Sources (Free, No Attribution Required)

1. **Pexels** - https://www.pexels.com/search/videos/walking%20stairs/
   - "Man Walking on Stairs" - search for business/corporate variants
   - Look for backlit or dramatic lighting

2. **Pixabay** - https://pixabay.com/videos/search/stairs%20walking/
   - Multiple free options, check for 1080p quality

3. **Mixkit** - https://mixkit.co/free-stock-video/stairs/
   - "Man walking up the stairs in slow motion"
   - "Business man going up stairs"

4. **Coverr** - https://coverr.co/search?q=stairs
   - High-quality free videos

### Video Specifications
- **Duration**: 4-8 seconds (will be scrubbed, not played)
- **Resolution**: Minimum 1080p (1920x1080), prefer 4K
- **Frame rate**: 24-30fps (more keyframes = smoother scrubbing)
- **Format**: MP4 (H.264)
- **Orientation**: Landscape (16:9)
- **File size target**: 4-8 MB
- **Style**: Cinematic, dramatic lighting, slight slow-motion works well

### Encoding for Smooth Scrubbing
Videos need frequent keyframes for smooth scroll scrubbing. Re-encode with:

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -g 15 -keyint_min 15 \
  -sc_threshold 0 -an -vf "scale=1920:1080" stairs.mp4
```

Options explained:
- `-g 15`: Keyframe every 15 frames (~0.5s at 30fps)
- `-keyint_min 15`: Minimum keyframe interval
- `-sc_threshold 0`: Disable scene change detection for consistent keyframes
- `-an`: Remove audio (not needed)
- `-crf 22`: Quality (18-23 is good balance)

---

## Scene B: Black Hole / Wormhole

**Narrative**: Falling through a cosmic wormhole/black hole, representing transformation and the leap into a new career.

### Search Terms
- "black hole wormhole tunnel"
- "space wormhole flying through"
- "cosmic tunnel hyperspace"
- "gravitational lensing black hole"
- "interstellar wormhole travel"

### Candidate Sources

1. **Pixabay** - https://pixabay.com/videos/search/wormhole/
   - "Wormhole Space Galaxy" - multiple options
   - "Black Hole Event Horizon"

2. **Pexels** - https://www.pexels.com/search/videos/wormhole/
   - Space/cosmic tunnel videos

3. **Mixkit** - https://mixkit.co/free-stock-video/space/
   - "Flying through a wormhole in space"
   - "Hyperspace tunnel animation"

4. **Videvo** - https://www.videvo.net/search/wormhole/
   - Some free options available (check license)

5. **NASA/ESA Public Domain**
   - https://images.nasa.gov/ (search black hole simulations)
   - These are public domain

### Video Specifications
- **Duration**: 3-6 seconds
- **Resolution**: 1080p minimum
- **Style**: Cosmic, swirling particles, lens distortion effects
- **Colors**: Blues, purples, or warm accretion disk colors
- **Motion**: Forward-moving camera, accelerating feel

### Encoding
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -g 12 -keyint_min 12 \
  -sc_threshold 0 -an -vf "scale=1920:1080" blackhole.mp4
```

---

## Scene C: Trading Floor

**Narrative**: Arriving on a Wall Street-style trading floor, person watching multiple screens showing market data.

### Search Terms
- "trading floor multiple screens"
- "stock market trader monitors"
- "wall street trading room"
- "finance trading desk screens"
- "person watching stock screens"

### Candidate Sources

1. **Pexels** - https://www.pexels.com/search/videos/trading%20floor/
   - "Stock Market Trading"
   - "Trader Looking at Screens"

2. **Pixabay** - https://pixabay.com/videos/search/trading/
   - "Stock Exchange Trading"
   - "Financial Markets Screens"

3. **Mixkit** - https://mixkit.co/free-stock-video/finance/
   - "Trader monitoring financial data"
   - "Stock market screens in office"

4. **Coverr** - https://coverr.co/search?q=trading
   - Business/finance category

### Video Specifications
- **Duration**: 4-8 seconds
- **Resolution**: 1080p minimum
- **Style**: Modern trading floor, glowing screens, person in frame
- **Lighting**: Screen glow, dramatic corporate lighting
- **Motion**: Slow camera movement, stable establishing shot

### Encoding
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -g 15 -keyint_min 15 \
  -sc_threshold 0 -an -vf "scale=1920:1080" trading.mp4
```

---

## Generating Poster Images

Extract the first frame from each video:

```bash
# Navigate to your cinematic folder
cd public/cinematic

# Generate posters
ffmpeg -i stairs.mp4 -vframes 1 -q:v 2 stairs-poster.jpg
ffmpeg -i blackhole.mp4 -vframes 1 -q:v 2 blackhole-poster.jpg
ffmpeg -i trading.mp4 -vframes 1 -q:v 2 trading-poster.jpg
```

Or pick a specific frame (e.g., frame 30):
```bash
ffmpeg -i stairs.mp4 -vf "select=eq(n\,30)" -vframes 1 -q:v 2 stairs-poster.jpg
```

---

## Quick Quality Checklist

Before using a video, verify:

- [ ] Resolution is at least 1920x1080
- [ ] No watermarks or logos
- [ ] License allows commercial/portfolio use (most free stock sites do)
- [ ] Good visual quality (no compression artifacts)
- [ ] Matches the narrative (professional, cinematic feel)
- [ ] File size is reasonable (under 10MB per clip ideally)

---

## Placeholder Files

If you need to test the build before downloading videos, create placeholder files:

```bash
cd public/cinematic

# Create 1-second black video placeholders
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=1 -c:v libx264 stairs.mp4
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=1 -c:v libx264 blackhole.mp4
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=1 -c:v libx264 trading.mp4

# Create black poster images
convert -size 1920x1080 xc:black stairs-poster.jpg
convert -size 1920x1080 xc:black blackhole-poster.jpg
convert -size 1920x1080 xc:black trading-poster.jpg
```

Or simply create empty/black JPG files of any size for initial testing.

---

## Licensing Notes

All recommended sources (Pexels, Pixabay, Mixkit, Coverr) provide:
- **Free for commercial use**
- **No attribution required** (though appreciated)
- **Modification allowed** (cropping, color grading, etc.)

Always double-check the specific license on the download page, as some videos may have different terms.

---

## Estimated Total Size

| Asset | Estimated Size |
|-------|---------------|
| stairs.mp4 | 4-8 MB |
| blackhole.mp4 | 3-6 MB |
| trading.mp4 | 4-8 MB |
| Posters (3x) | ~500 KB total |
| **Total** | **~12-23 MB** |

This is reasonable for a hero section and will load progressively.
