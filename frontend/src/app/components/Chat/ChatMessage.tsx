import { Bot, User, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import type { Message } from '../../../types';
import { apiClient } from '../../../api/client';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const isAssistant = message.role === 'assistant';

  const handleFeedback = async (helpful: boolean) => {
    setFeedback(helpful ? 'helpful' : 'not-helpful');
    await apiClient.submitFeedback({
      messageId: message.id,
      helpful,
    });
  };

  return (
    <div className={`flex gap-3 ${isAssistant ? 'bg-muted/30' : ''} p-4 rounded-lg`}>
      <div className="flex-shrink-0">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {isAssistant ? 'AI Assistant' : 'You'}
          </span>
          {message.confidence && (
            <Badge variant="outline" className="text-xs">
              {Math.round(message.confidence * 100)}% confident
            </Badge>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Sources:</p>
            <div className="space-y-1">
              {message.sources.map((source, idx) => (
                <Card key={idx} className="p-2 bg-background">
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{source.title}</p>
                      {source.version && (
                        <p className="text-xs text-muted-foreground">Version: {source.version}</p>
                      )}
                      {source.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {source.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isAssistant && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Was this helpful?</span>
            <Button
              variant={feedback === 'helpful' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFeedback(true)}
              className="h-7 px-2"
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant={feedback === 'not-helpful' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFeedback(false)}
              className="h-7 px-2"
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
