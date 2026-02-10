export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface ResumeProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface CVRecord {
  id: string;
  targetJob: string;
  date: string;
  profile: ResumeProfile;
}
