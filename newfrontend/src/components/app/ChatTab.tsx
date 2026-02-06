import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are my main responsibilities?",
  "How does the PTO policy work?",
  "What benefits am I eligible for?",
  "Who should I contact for IT support?",
];

export function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your onboarding assistant. I've analyzed your uploaded documents and I'm ready to help you understand your new role. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response - will be replaced with actual AI call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-card border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map(question => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="px-3 py-2 text-sm rounded-lg border bg-card hover:bg-muted transition-colors text-left"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-3 pt-4 border-t">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your role..."
          className="flex-1 h-12"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="h-12 px-6"
          variant="gradient"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function getSimulatedResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("responsibilities") || q.includes("role")) {
    return "Based on your job description, your main responsibilities include:\n\n• Leading cross-functional projects\n• Collaborating with stakeholders\n• Reporting on key metrics\n• Mentoring junior team members\n\nWould you like more details on any of these areas?";
  }
  
  if (q.includes("pto") || q.includes("vacation") || q.includes("time off")) {
    return "According to your benefits package, you have:\n\n• 15 days of PTO per year (accrued monthly)\n• 10 paid holidays\n• 5 sick days\n\nPTO requests should be submitted through the HR portal at least 2 weeks in advance for extended leave.";
  }
  
  if (q.includes("benefits") || q.includes("healthcare") || q.includes("insurance")) {
    return "Your benefits include:\n\n• Medical, dental, and vision insurance\n• 401(k) with 4% company match\n• Life insurance (1x salary)\n• Professional development stipend ($1,500/year)\n\nEnrollment opens during your first 30 days.";
  }
  
  if (q.includes("it") || q.includes("support") || q.includes("contact")) {
    return "For IT support, you can:\n\n• Email: it-support@company.com\n• Slack: #it-help channel\n• Phone: ext. 1234\n\nFor urgent issues outside business hours, there's an emergency IT hotline listed in your employee handbook.";
  }
  
  return "That's a great question! Based on your documents, I'd recommend checking with your manager or HR for the most accurate information on this topic. Is there anything else I can help you with?";
}
