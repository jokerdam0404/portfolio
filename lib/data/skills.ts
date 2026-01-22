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
    description: "DCF, LBO, M&A, and 3-statement models",
  },
  {
    name: "Valuation",
    category: "Finance",
    proficiency: 85,
    description: "DCF, Comps, Precedent Transactions",
  },
  {
    name: "Equity Research",
    category: "Finance",
    proficiency: 80,
    description: "Industry analysis and company research",
  },
  {
    name: "Accounting",
    category: "Finance",
    proficiency: 85,
    description: "Financial statement analysis",
  },
  {
    name: "M&A Analysis",
    category: "Finance",
    proficiency: 75,
    description: "Accretion/dilution, merger modeling",
  },
  {
    name: "Portfolio Management",
    category: "Finance",
    proficiency: 70,
    description: "Asset allocation and risk management",
  },

  // Technical Skills
  {
    name: "Python",
    category: "Technical",
    proficiency: 85,
    description: "Pandas, NumPy, financial analysis",
  },
  {
    name: "SQL",
    category: "Technical",
    proficiency: 75,
    description: "Data querying and manipulation",
  },
  {
    name: "R",
    category: "Technical",
    proficiency: 65,
    description: "Statistical analysis",
  },
  {
    name: "VBA",
    category: "Technical",
    proficiency: 70,
    description: "Excel automation",
  },

  // Tools
  {
    name: "Excel",
    category: "Tools",
    proficiency: 95,
    description: "Advanced formulas, pivot tables, modeling",
  },
  {
    name: "Bloomberg Terminal",
    category: "Tools",
    proficiency: 80,
    description: "Market data and research",
  },
  {
    name: "Capital IQ",
    category: "Tools",
    proficiency: 75,
    description: "Financial data and comps",
  },
  {
    name: "FactSet",
    category: "Tools",
    proficiency: 70,
    description: "Research and analytics",
  },
  {
    name: "Tableau",
    category: "Tools",
    proficiency: 75,
    description: "Data visualization",
  },
  {
    name: "PowerPoint",
    category: "Tools",
    proficiency: 90,
    description: "Professional presentations",
  },

  // Soft Skills
  {
    name: "Analytical Thinking",
    category: "Soft Skills",
    proficiency: 90,
  },
  {
    name: "Attention to Detail",
    category: "Soft Skills",
    proficiency: 95,
  },
  {
    name: "Communication",
    category: "Soft Skills",
    proficiency: 85,
  },
  {
    name: "Teamwork",
    category: "Soft Skills",
    proficiency: 90,
  },
];

export const skillCategories = [
  { name: "Finance", color: "bg-accent-500" },
  { name: "Technical", color: "bg-success-500" },
  { name: "Tools", color: "bg-primary-600" },
  { name: "Soft Skills", color: "bg-primary-400" },
];
