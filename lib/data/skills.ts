export interface Skill {
  name: string;
  category: "Finance" | "Technical" | "Tools" | "Soft Skills";
  proficiency: number; // 1-100
  description?: string;
}

export const skills: Skill[] = [
  // Finance Skills
  {
    name: "Financial Modeling",
    category: "Finance",
    proficiency: 90,
    description: "DCF, LBO, and valuation models",
  },
  {
    name: "Equity Research",
    category: "Finance",
    proficiency: 85,
    description: "Fundamental analysis and company research",
  },
  {
    name: "Valuation",
    category: "Finance",
    proficiency: 88,
    description: "DCF, Comparable Companies, LBO",
  },
  {
    name: "Financial Statement Analysis",
    category: "Finance",
    proficiency: 87,
    description: "P&L, Balance Sheet, Cash Flow analysis",
  },
  {
    name: "Portfolio Management",
    category: "Finance",
    proficiency: 80,
    description: "Managing $5M mid-cap fund",
  },
  {
    name: "Stochastic Models",
    category: "Finance",
    proficiency: 75,
    description: "Actuarial mathematics and modeling",
  },

  // Technical Skills
  {
    name: "Python",
    category: "Technical",
    proficiency: 90,
    description: "Data analysis, simulations, modeling",
  },
  {
    name: "C++",
    category: "Technical",
    proficiency: 85,
    description: "Geant4 simulations, computational physics",
  },
  {
    name: "C",
    category: "Technical",
    proficiency: 80,
    description: "Systems programming",
  },
  {
    name: "ROOT",
    category: "Technical",
    proficiency: 75,
    description: "Data analysis framework for physics",
  },
  {
    name: "Geant4",
    category: "Technical",
    proficiency: 78,
    description: "Particle physics simulation toolkit",
  },
  {
    name: "CMake",
    category: "Technical",
    proficiency: 70,
    description: "Build system management",
  },

  // Tools
  {
    name: "Excel",
    category: "Tools",
    proficiency: 92,
    description: "Advanced financial modeling",
  },
  {
    name: "Bloomberg Terminal",
    category: "Tools",
    proficiency: 75,
    description: "Market data and research (assumed experience)",
  },
  {
    name: "AWS",
    category: "Tools",
    proficiency: 80,
    description: "Solutions Architect Associate certified",
  },
  {
    name: "Git",
    category: "Tools",
    proficiency: 75,
    description: "Version control",
  },

  // Soft Skills
  {
    name: "Leadership",
    category: "Soft Skills",
    proficiency: 90,
    description: "Led emergency response teams, council positions",
  },
  {
    name: "Analytical Thinking",
    category: "Soft Skills",
    proficiency: 95,
    description: "Physics and finance analysis",
  },
  {
    name: "Team Collaboration",
    category: "Soft Skills",
    proficiency: 88,
    description: "Investment fund, research lab",
  },
  {
    name: "Public Speaking",
    category: "Soft Skills",
    proficiency: 85,
    description: "Debate and presentations",
  },
  {
    name: "Problem Solving",
    category: "Soft Skills",
    proficiency: 92,
    description: "Physics research and financial modeling",
  },
];

export const skillCategories = [
  { name: "Finance", color: "bg-accent-500" },
  { name: "Technical", color: "bg-success-500" },
  { name: "Tools", color: "bg-primary-600" },
  { name: "Soft Skills", color: "bg-primary-400" },
];
