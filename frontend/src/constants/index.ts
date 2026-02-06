export const APP_NAME = 'Onboarding AI';
export const APP_DESCRIPTION = 'Your personalized onboarding companion, learning from every hire';

export const CONFIDENCE_THRESHOLD = 0.7; // Threshold for showing low confidence warnings

export const ROLE_DISPLAY_NAMES = {
  engineer: 'Engineer',
  sales: 'Sales',
  ops: 'Operations',
  manager: 'Manager',
  other: 'Other',
} as const;

export const SENIORITY_DISPLAY_NAMES = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-blue-500/10 text-blue-700 border-blue-200',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  high: 'bg-red-500/10 text-red-700 border-red-200',
} as const;

export const INSIGHT_COLORS = {
  tip: 'bg-blue-500/10 text-blue-700 border-blue-200',
  warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  recommendation: 'bg-purple-500/10 text-purple-700 border-purple-200',
} as const;

export const SUGGESTED_QUESTIONS = [
  'How do I deploy my code?',
  'Who approves my PRs?',
  'What should I focus on this week?',
  'How do I access the staging environment?',
  'Where can I find the team documentation?',
  'What are the team rituals and meetings?',
  'How do I get help when I\'m stuck?',
  'What tools and accounts do I need access to?',
];
