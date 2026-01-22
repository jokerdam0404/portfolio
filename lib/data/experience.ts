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
    company: "Aramaki Lab",
    role: "Undergraduate Researcher",
    location: "Boston, Massachusetts",
    startDate: "2025-09",
    endDate: "",
    current: true,
    description: "Conducting advanced particle physics simulations for the GRAMS project using Geant4, ROOT, and C++.",
    achievements: [
      "Operated Geant4/ROOT simulation of the GRAMS LArTPC with plastic-scintillator TOF, compiling with CMake and running macro-driven batches to deliver reproducible detector studies",
      "Used Geant4's General Particle Source to scan energy and incidence angles, quantifying the impact on geometrical acceptance and TOF performance",
      "Executed antimatter stop-event studies and validated topologies in HepRApp, catching geometry issues before long runs and conserving compute",
      "Ran sensitivity analyses to rank the parameters that most influence acceptance and timing, guiding follow-up simulations",
    ],
    skills: ["Geant4", "ROOT", "C++", "CMake", "Data Analysis", "Computational Physics"],
  },
  {
    id: 2,
    company: "Michigan State University Student Investment Fund",
    role: "Equity Analyst",
    location: "East Lansing, Michigan",
    startDate: "2025-01",
    endDate: "2025-05",
    current: false,
    description: "Co-managing a $5 million mid-cap fund benchmarked against the S&P 400 with direct responsibility for select holdings in the financial sector.",
    achievements: [
      "Co-manage a $5 million mid-cap fund benchmarked against the S&P 400 with direct responsibility for select holdings in the financial sector",
      "Analyzed financial statements, assessing business prospects including revenue drivers and competitive positioning, and developing discounted cash flow valuation models to determine intrinsic value",
      "Performed financial statement analysis and key ratio assessments (ROE, EBITDA margins, P/E, P/B) to determine the valuation and financial health of companies across sectors",
      "Built comprehensive DCF models and conducted comparable company analysis for investment decisions",
    ],
    skills: ["Financial Modeling", "DCF Valuation", "Equity Research", "Financial Analysis", "Excel", "Portfolio Management"],
  },
  {
    id: 3,
    company: "Singapore Civil Defence Force",
    role: "Firefighter, Emergency Medical Technician, Support Specialist",
    location: "Singapore",
    startDate: "2021-04",
    endDate: "2023-02",
    current: false,
    description: "Led emergency response teams in critical situations while serving National Service.",
    achievements: [
      "Led emergency response teams in handling 60+ critical incidents, improving response times by 15% through strategic task allocation and equipment deployment",
      "Completed comprehensive Basic Rescue Training (BRT), specializing in hazard equipment operations, disaster response and safety protocols, ensuring readiness for emergency scenarios",
      "Developed and executed safety protocols, reducing on-site injuries by 20% and improving overall efficiency in rescue operations during COVID-19",
      "Demonstrated leadership, quick decision-making, and ability to perform under high-pressure situations",
    ],
    skills: ["Leadership", "Emergency Response", "Team Management", "Safety Protocols", "Critical Thinking"],
  },
];
