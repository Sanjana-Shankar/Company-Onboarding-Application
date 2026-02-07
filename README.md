# Onboarding AI - Frontend

A continuously learning onboarding companion built with React, TypeScript, and Tailwind CSS. This AI-powered application helps new hires navigate their onboarding journey by learning from past hires' questions, struggles, and successes.

## 🚀 Features

### Core Capabilities

- **AI Chat Assistant**: Context-aware chatbot that answers onboarding questions with confidence scoring and source citations
- **Role-Specific Onboarding Paths**: Personalized task timelines based on role, seniority, and team
- **Learning from Experience**: Shows completion rates and insights from previous successful hires
- **Feedback Loop**: Continuous improvement through user feedback on AI responses
- **Quick Actions**: Fast access to common resources and tasks

### Key Components

1. **Chat Interface** (`/src/app/components/Chat/`)
   - Real-time messaging with the AI assistant
   - Source citations for transparency
   - Confidence scoring for AI responses
   - Thumbs up/down feedback mechanism
   - Suggested questions for new users

2. **Onboarding Timeline** (`/src/app/components/OnboardingTimeline/`)
   - Week-by-week milestone tracking
   - Task prioritization (high/medium/low)
   - Completion rate statistics from past hires
   - Progress visualization
   - Category-based task organization

3. **User Profile** (`/src/app/components/Header/`)
   - Role and seniority badges
   - Days in role tracker
   - Department and team information

4. **Quick Actions** (`/src/app/components/QuickActions/`)
   - Fast access to common resources
   - Team directory
   - Documentation links
   - Meeting scheduling

## 🏗️ Architecture

### Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main application component
│   └── components/
│       ├── Chat/            # Chat interface components
│       ├── OnboardingTimeline/  # Timeline and task components
│       ├── Header/          # User profile and navigation
│       ├── Insights/        # AI-generated insights
│       ├── QuickActions/    # Quick action buttons
│       └── ui/              # Reusable UI components (shadcn/ui)
├── api/
│   └── client.ts            # API client with mock data
├── hooks/
│   ├── useChat.ts           # Chat state management
│   └── useOnboarding.ts     # Onboarding path state management
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   └── cn.ts                # Utility functions
└── styles/
    ├── index.css
    ├── tailwind.css
    ├── theme.css
    └── fonts.css
```

### Tech Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool and dev server
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications

## 🎨 Design System

The application uses a comprehensive design system with:

- **UI Components**: Built on Radix UI primitives for accessibility
- **Theming**: CSS custom properties for easy customization
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Color System**: Semantic color tokens for consistent theming

## 📡 API Integration

### Mock Data

The frontend includes comprehensive mock data for development:

- Sample user profiles
- Pre-populated onboarding milestones
- AI response simulations
- Realistic completion statistics

### API Client (`/src/api/client.ts`)

The API client is ready to connect to your Python backend with the following endpoints:

- `GET /user/current` - Get current user information
- `POST /chat/message` - Send chat message and get AI response
- `GET /chat/history/:id` - Get chat conversation history
- `GET /onboarding/path/:userId` - Get personalized onboarding path
- `PUT /onboarding/task/:taskId` - Update task completion status
- `POST /feedback` - Submit feedback on AI responses
- `GET /health` - Health check endpoint

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm, npm, or yarn

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Start development server
npm run build
# or
pnpm build
```

The application will be available at the URL provided by your development environment.

## 🔌 Connecting to Backend

To connect to your Python FastAPI backend:

1. Update `VITE_API_URL` in your `.env` file to point to your backend
2. The API client (`/src/api/client.ts`) will automatically use this URL
3. Remove or comment out the mock implementations in `apiClient` methods
4. Ensure CORS is properly configured on your backend

Example backend connection:

```typescript
// In /src/api/client.ts
async getCurrentUser(): Promise<User> {
  return this.request<User>('/user/current');
}
```

## 📊 Data Flow

1. **User Authentication**: User data is loaded on app initialization
2. **Onboarding Path**: Role-specific tasks and milestones are fetched
3. **Chat Interactions**: Messages are sent to AI, responses include sources and confidence
4. **Feedback Loop**: User feedback is collected and sent to improve the AI
5. **Progress Tracking**: Task completions update the onboarding timeline

## 🎯 Key Features Explained

### Confidence Scoring

AI responses include a confidence score (0-1) displayed as a percentage. This helps users understand when to verify information with a human.

### Source Citations

Every AI response includes citations to source documents, helping users:
- Verify information
- Find additional context
- Build trust in the AI

### Completion Rate Statistics

Tasks show what percentage of similar hires completed them by this point, based on:
- Role (engineer, sales, ops, etc.)
- Seniority level
- Team/department
- Historical data

### Feedback Mechanism

Simple thumbs up/down feedback on every AI response enables:
- Continuous learning
- Quality improvement
- Issue identification

## 🛡️ Trust & Safety

The frontend emphasizes trust and transparency:

- Clear "AI may make mistakes" disclaimers
- Confidence scoring on all responses
- Source citations for verification
- No personal performance data displayed
- Aggregated, anonymized insights only

## 🔮 Future Enhancements

- Real-time notifications for upcoming tasks
- Team chat integration (Slack/Teams)
- Manager dashboard for onboarding insights
- Predictive nudges for common blockers
- Knowledge graph visualization
- Voice interaction support
- Mobile app (React Native)

## 📝 Contributing

When adding new features:

1. Follow the existing component structure
2. Add TypeScript types in `/src/types/`
3. Use the existing UI components from `/src/app/components/ui/`
4. Maintain accessibility standards
5. Add loading and error states
6. Include user feedback mechanisms

## 📄 License

This project is part of the Onboarding AI system.

## 🤝 Support

For questions or issues:
- Check the inline code documentation
- Review the API client implementation
- Consult the component examples

---

Built with ❤️ to make onboarding better for everyone.
