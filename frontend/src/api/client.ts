import type { ChatResponse, FeedbackResponse, Message, OnboardingMilestone, OnboardingTask, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  role: 'engineer',
  seniority: 'mid',
  workLocation: 'remote',
  userType: 'ic',
  department: 'Payments',
  startDate: '2026-02-03',
};

const mockMilestones: OnboardingMilestone[] = [
  {
    id: 'week-1',
    title: 'Week 1: Foundation',
    description: 'Get set up and oriented with your team',
    weekNumber: 1,
    completed: false,
    tasks: [
      {
        id: 't1',
        title: 'Complete HR onboarding',
        description: 'Fill out all necessary paperwork and set up benefits',
        completed: true,
        priority: 'high',
        category: 'Admin',
        estimatedTime: '2 hours',
        completionRate: 95,
      },
      {
        id: 't2',
        title: 'Set up development environment',
        description: 'Install required tools, clone repos, and verify access',
        completed: true,
        priority: 'high',
        category: 'Technical',
        estimatedTime: '4 hours',
        completionRate: 88,
      },
      {
        id: 't3',
        title: 'Meet your team',
        description: 'Schedule 1:1s with your manager and key team members',
        completed: false,
        priority: 'high',
        category: 'Team',
        estimatedTime: '3 hours',
        completionRate: 92,
      },
      {
        id: 't4',
        title: 'Review codebase architecture',
        description: 'Go through the architecture docs and payment flow diagrams',
        completed: false,
        priority: 'medium',
        category: 'Technical',
        estimatedTime: '3 hours',
        completionRate: 78,
      },
    ],
  },
  {
    id: 'week-2',
    title: 'Week 2: Deep Dive',
    description: 'Start contributing and learning the systems',
    weekNumber: 2,
    completed: false,
    tasks: [
      {
        id: 't5',
        title: 'Fix your first bug',
        description: 'Pick up a good-first-issue from the backlog',
        completed: false,
        priority: 'high',
        category: 'Technical',
        estimatedTime: '4-6 hours',
        completionRate: 72,
      },
      {
        id: 't6',
        title: 'Understand deployment process',
        description: 'Shadow a deployment and review CI/CD pipelines',
        completed: false,
        priority: 'medium',
        category: 'Technical',
        estimatedTime: '2 hours',
        completionRate: 65,
      },
      {
        id: 't7',
        title: 'Join team rituals',
        description: 'Attend sprint planning, standups, and retro',
        completed: false,
        priority: 'medium',
        category: 'Team',
        estimatedTime: 'Ongoing',
        completionRate: 85,
      },
    ],
  },
  {
    id: 'week-3-4',
    title: 'Week 3-4: Independence',
    description: 'Take on larger work and start contributing meaningfully',
    weekNumber: 3,
    completed: false,
    tasks: [
      {
        id: 't8',
        title: 'Ship your first feature',
        description: 'Complete a small feature from design to production',
        completed: false,
        priority: 'high',
        category: 'Technical',
        estimatedTime: '1-2 weeks',
        completionRate: 60,
      },
      {
        id: 't9',
        title: 'Give feedback in code review',
        description: 'Start actively participating in code reviews',
        completed: false,
        priority: 'medium',
        category: 'Technical',
        estimatedTime: 'Ongoing',
        completionRate: 55,
      },
    ],
  },
];

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // Return mock data in development
      throw error;
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 300);
    });
  }

  // Chat endpoints
  async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    // Mock implementation with realistic responses
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponses = [
          {
            message: {
              id: Math.random().toString(),
              role: 'assistant' as const,
              content: "Great question! To deploy code in the Payments team, you'll need to:\n\n1. Create a pull request and get at least 2 approvals\n2. Ensure all CI checks pass (tests, linting, security scans)\n3. Merge to main - this triggers the staging deployment automatically\n4. After QA verification in staging, promote to production via the deployment dashboard\n\nMost backend engineers complete their first deployment in week 2-3. The deployment dashboard is at `deploy.company.com`.",
              timestamp: new Date(),
              sources: [
                {
                  title: 'Payments Team Deployment Guide v2.1',
                  url: 'https://docs.company.com/payments/deployment',
                  version: 'v2.1',
                  excerpt: 'All deployments require 2 code review approvals...',
                },
                {
                  title: 'Engineering Onboarding - CI/CD',
                  url: 'https://docs.company.com/engineering/cicd',
                },
              ],
              confidence: 0.92,
            },
            insights: [
              {
                id: 'i1',
                type: 'tip' as const,
                title: 'Pro tip from successful hires',
                description: "Shadow a senior engineer's deployment before doing your first one. 85% of backend engineers who did this felt more confident.",
                basedOn: '85% of backend engineers',
              },
            ],
          },
          {
            message: {
              id: Math.random().toString(),
              role: 'assistant' as const,
              content: "Your manager Sarah Chen typically reviews PRs within 4-6 hours during work hours (9am-5pm PST). She's in the #payments-team Slack channel.\n\nFor urgent reviews, you can also reach out to:\n- Marcus (Senior Backend Engineer) - usually very responsive\n- The #code-review-payments channel for the team\n\n90% of new engineers get their first PR reviewed within 8 hours of posting.",
              timestamp: new Date(),
              sources: [
                {
                  title: 'Team Directory - Payments',
                  url: 'https://directory.company.com/payments',
                },
              ],
              confidence: 0.88,
            },
          },
        ];

        resolve(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
      }, 800);
    });
  }

  async getChatHistory(conversationId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 300);
    });
  }

  // Onboarding endpoints
  async getOnboardingPath(userId: string): Promise<OnboardingMilestone[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMilestones), 400);
    });
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Task ${taskId} marked as ${completed ? 'completed' : 'incomplete'}`);
        resolve();
      }, 200);
    });
  }

  // Feedback endpoints
  async submitFeedback(feedback: Omit<FeedbackResponse, 'timestamp'>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Feedback submitted:', feedback);
        resolve();
      }, 200);
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 'ok', version: '0.1.0' }), 100);
    });
  }
}

export const apiClient = new ApiClient();
