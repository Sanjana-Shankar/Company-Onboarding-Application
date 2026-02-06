import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './app/components/ui/tabs';
import { ChatInterface } from './app/components/Chat/ChatInterface';
import { OnboardingTimeline } from './app/components/OnboardingTimeline/OnboardingTimeline';
import { UserProfile } from './app/components/Header/UserProfile';
import { QuickActions } from './app/components/QuickActions/QuickActions';
import { MessageSquare, CheckSquare, Sparkles } from 'lucide-react';
import { apiClient } from './api/client';
import type { User } from './types';
import { Skeleton } from './app/components/ui/skeleton';
import { Toaster } from './app/components/ui/sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Failed to load user data</h2>
          <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background">
      <div className="h-full max-w-7xl mx-auto p-6 space-y-6 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Onboarding AI</h1>
            </div>
            <p className="text-muted-foreground">
              Your personalized onboarding companion, learning from every hire
            </p>
          </div>
          <UserProfile user={user} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full max-w-md grid-cols-3 flex-shrink-0">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>Your Path</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Resources</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-6 min-h-0">
              <TabsContent value="chat" className="h-full m-0">
                <ChatInterface />
              </TabsContent>

              <TabsContent value="timeline" className="h-full m-0">
                <div className="h-full min-h-[500px] lg:min-h-0">
                  <OnboardingTimeline userId={user.id} />
                </div>
              </TabsContent>

              <TabsContent value="resources" className="h-full m-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <QuickActions />
                  <div className="space-y-4">
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold mb-3">Common Questions</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>How do I request PTO?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Where can I find the engineering standards?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>How does code review work here?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>What's the process for reporting a bug?</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}