export interface JourneyMilestone {
  id: number;
  date: string;
  title: string;
  category: "Course" | "Certification" | "Book" | "Project" | "Learning";
  description: string;
  skills: string[];
  resources?: string[];
}

export const journeyData: JourneyMilestone[] = [
  {
    id: 1,
    date: "2024-01",
    title: "Started Learning Financial Modeling",
    category: "Course",
    description: "Began comprehensive financial modeling course covering DCF, LBO, and M&A models.",
    skills: ["Excel", "Financial Modeling", "DCF Analysis"],
    resources: ["Wall Street Prep", "Breaking Into Wall Street"],
  },
  {
    id: 2,
    date: "2024-03",
    title: "Completed Bloomberg Market Concepts",
    category: "Certification",
    description: "Earned BMC certification covering economic indicators, currencies, fixed income, and equities.",
    skills: ["Bloomberg Terminal", "Market Analysis", "Economic Indicators"],
    resources: ["Bloomberg Terminal"],
  },
  {
    id: 3,
    date: "2024-05",
    title: "Built First DCF Valuation Model",
    category: "Project",
    description: "Created comprehensive DCF model for a publicly traded company with sensitivity analysis.",
    skills: ["Valuation", "Excel Modeling", "Financial Analysis"],
  },
  {
    id: 4,
    date: "2024-07",
    title: "Learned Python for Finance",
    category: "Learning",
    description: "Studied Python programming with focus on financial data analysis and automation.",
    skills: ["Python", "Pandas", "Data Analysis"],
    resources: ["Python for Finance", "Quantopian Lectures"],
  },
  {
    id: 5,
    date: "2024-09",
    title: "Read 'Investment Banking' by Rosenbaum",
    category: "Book",
    description: "Studied comprehensive guide to valuation, LBOs, and M&A analysis.",
    skills: ["Valuation Methods", "M&A", "LBO Modeling"],
  },
  {
    id: 6,
    date: "2024-11",
    title: "Started CFA Level 1 Preparation",
    category: "Certification",
    description: "Began studying for CFA Level 1 exam covering ethics, quantitative methods, and economics.",
    skills: ["CFA", "Ethics", "Quantitative Analysis"],
    resources: ["CFA Institute", "Kaplan Schweser"],
  },
];
