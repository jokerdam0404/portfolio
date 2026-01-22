# Quick Start Guide

This is a **10-minute customization guide** to get your portfolio up and running with your personal information.

## Step 1: Update Personal Information (5 min)

### Hero Section
**File:** `components/sections/Hero.tsx`

Find and replace:
- Line 65: `"Your Name"` → Your actual name
- Line 72-79: Update the typing animation sequence with your roles
- Line 84-87: Replace the description with your elevator pitch

### About Section
**File:** `components/sections/About.tsx`

- Line 77-101: Replace the three paragraphs with your bio
- Line 111: Update interests array with your specific areas

### Contact Section
**File:** `components/sections/Contact.tsx`

Replace all instances of:
- Line 32, 47, 61: `your.email@example.com` → Your email
- Line 47: LinkedIn URL
- Line 54: GitHub URL

### Page Metadata
**File:** `app/layout.tsx`

- Line 7: Update title
- Line 8: Update description
- Line 10: Update author name

## Step 2: Add Your Content (3 min)

### Quick Content Updates

All content files are in `lib/data/`. Replace the sample data with yours:

1. **Finance Journey** (`lib/data/journey.ts`)
   - Add your courses, certifications, learning milestones

2. **Projects** (`lib/data/projects.ts`)
   - Add your finance projects (DCF models, research, etc.)

3. **Experience** (`lib/data/experience.ts`)
   - Add your internships and work experience

4. **Skills** (`lib/data/skills.ts`)
   - Update skill levels (1-100 scale)

5. **Education** (`lib/data/education.ts`)
   - Add your university and certifications

## Step 3: Add Your Resume (1 min)

Replace `public/resume.pdf` with your actual resume PDF file.

## Step 4: Test Locally (1 min)

```bash
npm run dev
```

Visit http://localhost:3000 and verify everything looks good!

## Deploy to Vercel (Bonus - 5 min)

1. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy" (Vercel auto-detects Next.js)
6. Your site is live! 🎉

## Optional Enhancements

### Add Images
- Profile photo: `public/images/profile.jpg`
- Reference in `components/sections/About.tsx`

### Customize Colors
Edit `tailwind.config.ts` to change the color scheme.

### Add Custom Domain
In Vercel dashboard: Settings → Domains → Add your domain

---

**You're done!** Your professional finance portfolio is ready to impress recruiters. 🚀

For detailed customization, see the full [README.md](README.md).
