import { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../../../hooks/useChat';
import { Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { InsightsList } from '../Insights/InsightsList';
import type { OnboardingInsight } from '../../../types';

const suggestedQuestions = [
  'How do I deploy my code?',
  'Who approves my PRs?',
  'What should I focus on this week?',
  'How do I access the staging environment?',
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [insights, setInsights] = useState<OnboardingInsight[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      <Card className="flex flex-col h-full lg:col-span-2">
        <div className="p-4 border-b">
          <h2 className="font-semibold">AI Onboarding Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Ask questions about onboarding, team processes, or anything else
          </p>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    I'm here to help you navigate your onboarding journey. I learn from past hires'
                    experiences to give you the most relevant guidance for your role.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Try asking:</p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(question)}
                        className="text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
          <p className="text-xs text-muted-foreground mt-2">
            AI may make mistakes. Please verify important information.
          </p>
        </div>
      </Card>

      <div className="hidden lg:block">
        <InsightsList insights={insights} />
      </div>
    </div>
  );
}