export interface Project {
  id: number;
  title: string;
  category: "Financial Modeling" | "Data Analysis" | "Computational Physics" | "Equity Research" | "Cloud Computing";
  description: string;
  longDescription?: string;
  skills: string[];
  techStack: string[];
  link?: string;
  github?: string;
  image?: string;
  featured: boolean;
  outcomes?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Equity Research & Valuation Models",
    category: "Financial Modeling",
    description: "Comprehensive DCF valuation models and financial analysis for mid-cap companies in the $5M Student Investment Fund.",
    longDescription: "As part of the MSU Student Investment Fund, built detailed discounted cash flow models for multiple mid-cap companies, incorporating revenue projections, WACC calculations, and sensitivity analysis to determine intrinsic value.",
    skills: ["Financial Modeling", "DCF Valuation", "Equity Research", "Excel"],
    techStack: ["Excel", "Financial Databases", "Bloomberg Terminal"],
    featured: true,
    outcomes: [
      "Built comprehensive DCF models for financial sector holdings",
      "Performed ratio analysis (ROE, EBITDA margins, P/E, P/B) across sectors",
      "Analyzed revenue drivers and competitive positioning for investment decisions",
      "Contributed to managing $5M mid-cap fund benchmarked against S&P 400",
    ],
  },
  {
    id: 2,
    title: "GRAMS Particle Physics Simulation",
    category: "Computational Physics",
    description: "Geant4/ROOT simulation of the GRAMS LArTPC detector with plastic-scintillator TOF for antimatter studies.",
    longDescription: "Operated advanced particle physics simulations using Geant4 and ROOT frameworks, running macro-driven batches to deliver reproducible detector studies and sensitivity analyses.",
    skills: ["Geant4", "ROOT", "C++", "CMake", "Data Analysis"],
    techStack: ["Geant4", "ROOT", "C++", "CMake", "HepRApp"],
    github: "https://github.com/achintyachaganti",
    featured: true,
    outcomes: [
      "Compiled and ran macro-driven simulation batches for reproducible detector studies",
      "Scanned energy and incidence angles to quantify impact on geometrical acceptance",
      "Executed antimatter stop-event studies and validated topologies",
      "Conducted sensitivity analyses to guide follow-up simulations",
    ],
  },
  {
    id: 3,
    title: "Financial Statement Analysis Dashboard",
    category: "Data Analysis",
    description: "Python-based dashboard for automated financial statement analysis and ratio calculations.",
    longDescription: "Developed a Python tool to automate financial statement analysis, calculating key ratios and visualizing trends for equity research purposes.",
    skills: ["Python", "Financial Analysis", "Data Visualization"],
    techStack: ["Python", "Pandas", "Matplotlib", "Excel"],
    github: "https://github.com/achintyachaganti",
    featured: false,
    outcomes: [
      "Automated calculation of ROE, EBITDA margins, P/E, and P/B ratios",
      "Created visualizations for trend analysis across time periods",
      "Reduced manual analysis time by 60%",
    ],
  },
  {
    id: 4,
    title: "Stochastic Models for Risk Assessment",
    category: "Financial Modeling",
    description: "Application of actuarial mathematics and stochastic processes to model financial risk.",
    longDescription: "Applied concepts from Actuarial Mathematics coursework to build stochastic models for risk assessment and probability analysis in financial contexts.",
    skills: ["Stochastic Models", "Risk Management", "Probability Theory"],
    techStack: ["Python", "R", "Excel"],
    featured: false,
    outcomes: [
      "Developed Monte Carlo simulations for risk scenarios",
      "Applied probability theory to financial decision-making",
      "Modeled uncertainty in cash flow projections",
    ],
  },
  {
    id: 5,
    title: "AWS Cloud Architecture Projects",
    category: "Cloud Computing",
    description: "Cloud infrastructure design and implementation projects as AWS Solutions Architect Associate.",
    longDescription: "Designed and implemented cloud solutions on AWS, earning Solutions Architect Associate certification and multiple AWS Partner certifications.",
    skills: ["AWS", "Cloud Architecture", "Solutions Design"],
    techStack: ["AWS", "EC2", "S3", "Lambda", "CloudFormation"],
    featured: false,
    outcomes: [
      "Earned AWS Solutions Architect Associate certification",
      "Completed AWS Partner certifications (Technical, Business, Cloud Economics)",
      "Designed scalable and cost-effective cloud solutions",
    ],
  },
  {
    id: 6,
    title: "Comparative Company Analysis",
    category: "Equity Research",
    description: "Comparable company analysis for valuation across financial and technology sectors.",
    longDescription: "Conducted comprehensive comparable company analysis using trading multiples and transaction precedents to support investment decisions for the Student Investment Fund.",
    skills: ["Equity Research", "Valuation", "Comp Analysis"],
    techStack: ["Excel", "Financial Databases"],
    featured: true,
    outcomes: [
      "Analyzed trading multiples (EV/EBITDA, P/E) for peer comparison",
      "Identified valuation discrepancies and investment opportunities",
      "Supported buy/sell recommendations with quantitative analysis",
    ],
  },
];
