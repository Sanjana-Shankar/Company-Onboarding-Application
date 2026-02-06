export type UserRole = 'engineer' | 'sales' | 'ops' | 'manager' | 'other';
export type Seniority = 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
export type WorkLocation = 'remote' | 'in-office' | 'hybrid';
export type UserType = 'manager' | 'ic';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  seniority: Seniority;
  workLocation: WorkLocation;
  userType: UserType;
  department?: string;
  startDate: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  confidence?: number;
}

export interface Source {
  title: string;
  url?: string;
  version?: string;
  excerpt?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedTime?: string;
  completionRate?: number; // % of people who completed this by this time
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  tasks: OnboardingTask[];
  completed: boolean;
}

export interface FeedbackResponse {
  messageId: string;
  helpful: boolean;
  comment?: string;
  timestamp: Date;
}

export interface OnboardingInsight {
  id: string;
  type: 'tip' | 'warning' | 'recommendation';
  title: string;
  description: string;
  basedOn?: string; // e.g., "80% of backend engineers..."
}

export interface ChatResponse {
  message: Message;
  relatedTasks?: OnboardingTask[];
  insights?: OnboardingInsight[];
}
