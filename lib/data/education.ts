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
    institution: "Northeastern University",
    degree: "Bachelor of Science",
    field: "Physics",
    location: "Boston, Massachusetts",
    startDate: "2025-08",
    endDate: "2027-12",
    gpa: "In Progress",
    honors: [],
    coursework: [
      "Classical Mechanics",
      "Quantum Mechanics",
      "Computational Physics",
      "Advanced Laboratory",
    ],
    activities: [
      "Aramaki Lab - Undergraduate Researcher",
    ],
  },
  {
    id: 2,
    institution: "Michigan State University",
    degree: "Bachelor of Science",
    field: "Physics and Economics",
    location: "East Lansing, Michigan",
    startDate: "2023-08",
    endDate: "2025-05",
    gpa: "3.56/4.0",
    honors: [
      "Dean's List (top 20% of Physics and Economics undergraduates)",
    ],
    coursework: [
      "Security Analysis",
      "Actuarial Mathematics",
      "Classical Mechanics",
      "Econometrics",
      "Financial Economics",
    ],
    activities: [
      "Student Investment Fund - Equity Analyst",
      "Associate Students of Michigan State University",
      "Sophomore Class Council",
      "General Assembly",
      "Student Life & Engagement Council",
      "MSUIISA - Event Coordinator",
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: 1,
    name: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Professional certification in cloud architecture and AWS services.",
    skills: ["AWS", "Cloud Computing", "Solutions Architecture"],
  },
  {
    id: 2,
    name: "AWS Partner - Technical",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Technical accreditation for AWS partner solutions.",
    skills: ["AWS", "Cloud Solutions"],
  },
  {
    id: 3,
    name: "AWS Partner - Business",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Business accreditation for AWS partner solutions.",
    skills: ["AWS", "Cloud Economics"],
  },
  {
    id: 4,
    name: "AWS Partner - Cloud Economics",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Specialization in cloud economics and cost optimization.",
    skills: ["AWS", "Cloud Economics", "Cost Optimization"],
  },
  {
    id: 5,
    name: "Ambulance and First Aid Certified",
    issuer: "Singapore Civil Defence Force",
    date: "2021",
    description: "Emergency medical response and first aid certification.",
    skills: ["Emergency Response", "First Aid", "EMT"],
  },
];
