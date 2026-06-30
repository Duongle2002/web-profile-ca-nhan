export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: string;
  stats: { label: string; value: string }[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
  type: 'work' | 'education' | 'activity';
  details: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: { name: string; level: number; iconName: string }[];
}

export interface GuestbookMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  emoji: string;
  avatarSeed: number;
}
