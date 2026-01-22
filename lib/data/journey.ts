export interface JourneyMilestone {
  id: number;
  date: string;
  title: string;
  category: "Course" | "Certification" | "Book" | "Project" | "Learning" | "Role";
  description: string;
  skills: string[];
  resources?: string[];
}

export const journeyData: JourneyMilestone[] = [
  {
    id: 1,
    date: "2023-08",
    title: "Started Dual Degree in Physics & Economics",
    category: "Learning",
    description: "Began studying Physics and Economics at Michigan State University, laying the foundation for quantitative and financial analysis.",
    skills: ["Physics", "Economics", "Mathematics"],
    resources: ["Michigan State University"],
  },
  {
    id: 2,
    date: "2024-01",
    title: "Security Analysis Course",
    category: "Course",
    description: "Enrolled in Security Analysis course, learning fundamental and technical analysis of financial securities.",
    skills: ["Equity Analysis", "Valuation", "Financial Statement Analysis"],
  },
  {
    id: 3,
    date: "2024-03",
    title: "Actuarial Mathematics",
    category: "Course",
    description: "Studied stochastic models and probability theory applied to financial and insurance contexts.",
    skills: ["Stochastic Models", "Probability", "Risk Management"],
  },
  {
    id: 4,
    date: "2024-06",
    title: "AWS Solutions Architect Associate",
    category: "Certification",
    description: "Earned AWS Solutions Architect Associate certification, demonstrating cloud computing expertise.",
    skills: ["AWS", "Cloud Architecture", "Technical Infrastructure"],
    resources: ["Amazon Web Services"],
  },
  {
    id: 5,
    date: "2024-08",
    title: "AWS Partner Certifications",
    category: "Certification",
    description: "Completed AWS Partner certifications in Technical, Business, and Cloud Economics tracks.",
    skills: ["Cloud Solutions", "Cloud Economics", "Business Strategy"],
  },
  {
    id: 6,
    date: "2025-01",
    title: "Joined MSU Student Investment Fund",
    category: "Role",
    description: "Became an Equity Analyst managing a $5 million mid-cap fund benchmarked against the S&P 400.",
    skills: ["Equity Research", "Financial Modeling", "Portfolio Management", "DCF Valuation"],
    resources: ["Michigan State University"],
  },
  {
    id: 7,
    date: "2025-01",
    title: "Mastered Financial Modeling",
    category: "Learning",
    description: "Developed expertise in building DCF models, performing comparable company analysis, and conducting financial statement analysis.",
    skills: ["DCF", "LBO", "Financial Modeling", "Excel", "Valuation"],
  },
  {
    id: 8,
    date: "2025-08",
    title: "Transferred to Northeastern University",
    category: "Learning",
    description: "Continued Physics degree at Northeastern University while maintaining finance focus.",
    skills: ["Physics", "Computational Methods"],
  },
  {
    id: 9,
    date: "2025-09",
    title: "Joined Aramaki Lab as Researcher",
    category: "Role",
    description: "Started undergraduate research in particle physics, working with Geant4/ROOT simulations for the GRAMS project.",
    skills: ["Geant4", "ROOT", "C++", "Data Analysis", "Computational Physics"],
    resources: ["Northeastern University", "Aramaki Lab"],
  },
  {
    id: 10,
    date: "2025-10",
    title: "Advanced Computational Skills",
    category: "Learning",
    description: "Developed proficiency in Python, C++, and C for both physics simulations and financial modeling applications.",
    skills: ["Python", "C++", "C", "CMake", "Data Analysis"],
  },
];
