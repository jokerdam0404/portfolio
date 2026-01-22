# Finance-Focused Personal Portfolio Website

A cutting-edge, highly interactive personal portfolio website showcasing your finance journey, built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and GSAP.

## Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript
- **Stunning Animations**: Combined Framer Motion & GSAP for professional effects
- **Finance-Optimized Design**: Professional color scheme suitable for IB/PE/HF applications
- **Fully Responsive**: Mobile-first design that works on all devices
- **Easy Content Management**: All content in separate data files for easy updates
- **SEO Optimized**: Built-in metadata and Open Graph tags
- **Performance Focused**: Optimized for Lighthouse scores >90

## Sections

1. **Hero** - Full-screen landing with animated gradient background
2. **About** - Professional introduction with skills overview
3. **Finance Journey** - Interactive timeline of your learning path (unique!)
4. **Projects** - Grid of finance projects with filtering
5. **Experience** - Professional work experience
6. **Skills** - Animated skill bars by category
7. **Education** - Academic background and certifications
8. **Contact** - Social links and resume download

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

## Customizing Your Portfolio

### 1. Personal Information

Update these key files with your information:

#### Hero Section
Edit `components/sections/Hero.tsx`:
- Line 65: Change "Your Name" to your actual name
- Line 72-79: Customize the typing animation text
- Line 84-87: Update the description

#### About Section
Edit `components/sections/About.tsx`:
- Line 77-101: Update your bio and interests
- Add your photo: Replace the placeholder in lines 56-64

#### Navigation & Layout
Edit `app/layout.tsx`:
- Line 7: Update page title
- Line 8: Update description
- Line 10: Update author name

### 2. Content Data Files

All content is in `lib/data/` - just edit the TypeScript objects:

#### Finance Journey (`lib/data/journey.ts`)
Add/edit milestones:
```typescript
{
  id: 1,
  date: "2024-01",
  title: "Your milestone title",
  category: "Course" | "Certification" | "Book" | "Project" | "Learning",
  description: "Description of what you did",
  skills: ["Skill 1", "Skill 2"],
  resources: ["Resource 1", "Resource 2"],
}
```

#### Projects (`lib/data/projects.ts`)
Add/edit projects:
```typescript
{
  id: 1,
  title: "Project Name",
  category: "Financial Modeling" | "Data Analysis" | "Algo Trading" | "Equity Research",
  description: "Short description",
  skills: ["Excel", "Python"],
  techStack: ["Excel", "Bloomberg"],
  github: "https://github.com/...",
  featured: true,
}
```

#### Experience (`lib/data/experience.ts`)
Add/edit work experience:
```typescript
{
  id: 1,
  company: "Company Name",
  role: "Job Title",
  location: "City, State",
  startDate: "2024-06",
  endDate: "2024-08",
  current: false,
  achievements: ["Achievement 1", "Achievement 2"],
  skills: ["Skill 1", "Skill 2"],
}
```

#### Skills (`lib/data/skills.ts`)
Add/edit skills:
```typescript
{
  name: "Financial Modeling",
  category: "Finance" | "Technical" | "Tools" | "Soft Skills",
  proficiency: 90, // 1-100
  description: "Optional description",
}
```

#### Education (`lib/data/education.ts`)
Update your education and certifications.

### 3. Add Your Resume

Replace `public/resume.pdf` with your actual resume PDF file.

### 4. Update Contact Information

Edit `components/sections/Contact.tsx`:
- Line 32: Update email
- Line 47: Update LinkedIn URL
- Line 54: Update GitHub URL
- Line 61: Update email

### 5. Add Images

Add images to `public/images/` and reference them:
- Profile photo for About section
- Project screenshots
- Company logos

## Color Customization

The color scheme is defined in `tailwind.config.ts`:
- **Primary**: Deep Navy (#0F172A) - Professional background
- **Accent**: Electric Blue (#3B82F6) - Call-to-action buttons
- **Success**: Emerald (#10B981) - Positive indicators

To change colors, edit the `colors` section in `tailwind.config.ts`.

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

#### Custom Domain
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Other Deployment Options
- **Netlify**: Similar to Vercel, auto-detects Next.js
- **AWS Amplify**: For AWS-integrated workflows
- **Self-hosted**: Build and deploy to your own server

## Project Structure

```
finance-portfolio/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── sections/            # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── FinanceJourney.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── animations/          # Animation wrappers
│   └── Navigation.tsx       # Navigation bar
├── lib/
│   ├── data/               # Content data files
│   │   ├── journey.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   └── education.ts
│   ├── animations.ts       # Animation configurations
│   └── utils.ts            # Utility functions
├── public/
│   ├── images/            # Images
│   └── resume.pdf         # Your resume
└── styles/
    └── animations.css     # Custom animations
```

## Tips for Success

### For Investment Banking Applications
- Emphasize deal experience and financial modeling skills
- Highlight transaction values and quantitative achievements
- Keep design professional and clean (current theme is perfect)
- Include relevant certifications (CFA, BMC, etc.)

### SEO Optimization
- Update metadata in `app/layout.tsx`
- Add descriptive alt text to images
- Use semantic HTML (already implemented)

### Performance
- Optimize images before adding them
- Keep images under 200KB
- Use WebP format when possible
- Test with Lighthouse in Chrome DevTools

## Troubleshooting

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear Next.js cache: `rm -rf .next`

### Styling Issues
- Ensure Tailwind classes are correct
- Check browser console for errors
- Verify imports are correct

### Animation Not Working
- Check that components are client components ("use client")
- Verify GSAP and Framer Motion are installed
- Test in different browsers

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Component animations
- **GSAP** - Advanced scroll animations
- **Geist Font** - Professional typography

## License

This project is open source and available for personal use.

## Support

If you encounter issues:
1. Check this README
2. Review the code comments
3. Check Next.js documentation: https://nextjs.org/docs

---

**Built with passion for finance and technology**

Good luck with your finance career! 🚀📊
