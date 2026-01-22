export interface Project {
  id: number;
  title: string;
  category: "Financial Modeling" | "Data Analysis" | "Algo Trading" | "Equity Research" | "Full-Stack";
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
    title: "DCF Valuation Model - Tesla",
    category: "Financial Modeling",
    description: "Comprehensive discounted cash flow model for Tesla with scenario and sensitivity analysis.",
    longDescription: "Built a detailed DCF valuation model projecting 10-year cash flows, calculating WACC, and determining enterprise and equity values. Included multiple scenario analyses and sensitivity tables.",
    skills: ["Financial Modeling", "Valuation", "DCF Analysis", "Excel"],
    techStack: ["Excel", "Bloomberg Terminal"],
    featured: true,
    outcomes: [
      "Projected 10-year revenue and operating margins",
      "Calculated WACC using CAPM and market data",
      "Created sensitivity analysis across key assumptions",
    ],
  },
  {
    id: 2,
    title: "Stock Market Dashboard",
    category: "Data Analysis",
    description: "Interactive dashboard analyzing S&P 500 performance with Python and real-time data visualization.",
    longDescription: "Developed a real-time stock market dashboard that pulls live data, performs technical analysis, and visualizes trends for S&P 500 constituents.",
    skills: ["Python", "Data Visualization", "Financial Analysis"],
    techStack: ["Python", "Pandas", "Plotly", "yfinance API"],
    github: "https://github.com/yourusername/stock-dashboard",
    featured: true,
    outcomes: [
      "Real-time data fetching from Yahoo Finance API",
      "Technical indicators (RSI, MACD, Bollinger Bands)",
      "Interactive charts with Plotly",
    ],
  },
  {
    id: 3,
    title: "Comparable Company Analysis Tool",
    category: "Equity Research",
    description: "Automated tool for generating trading and transaction comps for valuation analysis.",
    skills: ["Valuation", "Equity Research", "Excel"],
    techStack: ["Excel", "VBA", "Capital IQ"],
    featured: false,
    outcomes: [
      "Automated data collection from Capital IQ",
      "Generated trading multiples (EV/EBITDA, P/E)",
      "Created professional output tables",
    ],
  },
  {
    id: 4,
    title: "Algorithmic Trading Strategy",
    category: "Algo Trading",
    description: "Mean reversion trading strategy backtested on historical stock data.",
    longDescription: "Implemented a quantitative trading strategy using statistical arbitrage principles, backtested on 5 years of historical data.",
    skills: ["Quantitative Analysis", "Python", "Backtesting"],
    techStack: ["Python", "Backtrader", "NumPy", "Pandas"],
    github: "https://github.com/yourusername/algo-trading",
    featured: true,
    outcomes: [
      "15% annualized return in backtesting",
      "Sharpe ratio of 1.4",
      "Maximum drawdown under 12%",
    ],
  },
  {
    id: 5,
    title: "LBO Model - Hypothetical Buyout",
    category: "Financial Modeling",
    description: "Leveraged buyout model analyzing acquisition financing, returns, and exit scenarios.",
    skills: ["LBO Modeling", "Private Equity", "Financial Analysis"],
    techStack: ["Excel"],
    featured: false,
    outcomes: [
      "Modeled 5-year holding period",
      "Calculated IRR and MOIC under various scenarios",
      "Analyzed debt paydown schedule",
    ],
  },
  {
    id: 6,
    title: "Portfolio Optimization Tool",
    category: "Data Analysis",
    description: "Python-based portfolio optimizer using Modern Portfolio Theory and efficient frontier.",
    skills: ["Portfolio Management", "Python", "Optimization"],
    techStack: ["Python", "SciPy", "NumPy", "Matplotlib"],
    github: "https://github.com/yourusername/portfolio-optimizer",
    featured: false,
    outcomes: [
      "Efficient frontier visualization",
      "Optimal portfolio weights calculation",
      "Risk-return tradeoff analysis",
    ],
  },
];
