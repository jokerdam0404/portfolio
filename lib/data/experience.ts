export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  logo?: string;
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Investment Bank / Financial Services Firm",
    role: "Investment Banking Intern",
    location: "New York, NY",
    startDate: "2024-06",
    endDate: "2024-08",
    current: false,
    description: "Summer analyst in the M&A group supporting deal execution and client presentations.",
    achievements: [
      "Built financial models for 3 active M&A transactions totaling $500M+ in deal value",
      "Conducted comparable company analysis and precedent transaction analysis for pitch materials",
      "Created presentations for client meetings and management roadshows",
      "Performed detailed industry research and competitive analysis",
    ],
    skills: ["Financial Modeling", "M&A Analysis", "Excel", "PowerPoint", "Valuation"],
  },
  {
    id: 2,
    company: "Asset Management Company",
    role: "Equity Research Intern",
    location: "Boston, MA",
    startDate: "2024-01",
    endDate: "2024-05",
    current: false,
    description: "Supported equity research team covering technology and consumer sectors.",
    achievements: [
      "Published research reports on 5 companies with buy/sell recommendations",
      "Built and maintained financial models tracking earnings and revenue forecasts",
      "Presented investment ideas at weekly team meetings",
      "Monitored industry trends and competitive dynamics",
    ],
    skills: ["Equity Research", "Financial Modeling", "Valuation", "Industry Analysis"],
  },
  {
    id: 3,
    company: "Fintech Startup",
    role: "Financial Analyst Intern",
    location: "San Francisco, CA",
    startDate: "2023-06",
    endDate: "2023-08",
    current: false,
    description: "Analyzed user data and supported business development initiatives.",
    achievements: [
      "Built financial dashboards tracking key metrics and user growth",
      "Conducted market sizing analysis for new product launches",
      "Supported fundraising process with financial projections and investor materials",
      "Automated reporting processes using Python and SQL",
    ],
    skills: ["Financial Analysis", "Python", "SQL", "Data Visualization", "Business Strategy"],
  },
];
