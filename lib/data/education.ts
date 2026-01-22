export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
  activities?: string[];
  logo?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description?: string;
  skills?: string[];
}

export const education: Education[] = [
  {
    id: 1,
    institution: "University Name",
    degree: "Bachelor of Science",
    field: "Finance",
    location: "City, State",
    startDate: "2021-09",
    endDate: "2025-05",
    gpa: "3.8/4.0",
    honors: [
      "Dean's List (All Semesters)",
      "Finance Department Scholar",
      "Cum Laude",
    ],
    coursework: [
      "Corporate Finance",
      "Investment Analysis",
      "Financial Derivatives",
      "Econometrics",
      "Financial Accounting",
      "Valuation",
      "Portfolio Management",
      "Fixed Income Securities",
    ],
    activities: [
      "Finance Club - Vice President",
      "Investment Fund - Analyst",
      "Case Competition Team",
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: 1,
    name: "Bloomberg Market Concepts (BMC)",
    issuer: "Bloomberg",
    date: "2024-03",
    description: "Comprehensive certification covering economic indicators, currencies, fixed income, and equities.",
    skills: ["Bloomberg Terminal", "Market Analysis", "Economics"],
  },
  {
    id: 2,
    name: "CFA Level 1 Candidate",
    issuer: "CFA Institute",
    date: "2025-02",
    description: "Currently preparing for CFA Level 1 exam covering ethics, quantitative methods, economics, and financial analysis.",
    skills: ["Ethics", "Financial Analysis", "Economics", "Quantitative Methods"],
  },
  {
    id: 3,
    name: "Financial Modeling & Valuation Analyst (FMVA)",
    issuer: "Corporate Finance Institute",
    date: "2024-06",
    description: "Comprehensive program covering financial modeling, valuation, and Excel skills.",
    skills: ["Financial Modeling", "Valuation", "Excel"],
  },
  {
    id: 4,
    name: "Python for Finance",
    issuer: "DataCamp",
    date: "2024-07",
    description: "Professional certification in Python programming for financial analysis and quantitative finance.",
    skills: ["Python", "Pandas", "NumPy", "Financial Analysis"],
  },
];
