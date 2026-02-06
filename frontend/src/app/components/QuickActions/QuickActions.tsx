import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Users, Calendar, HelpCircle, MessageSquare, BookOpen } from 'lucide-react';

const actions = [
  {
    icon: FileText,
    label: 'View Docs',
    description: 'Company handbook',
  },
  {
    icon: Users,
    label: 'Team Directory',
    description: 'Find teammates',
  },
  {
    icon: Calendar,
    label: 'Schedule 1:1s',
    description: 'Book meetings',
  },
  {
    icon: MessageSquare,
    label: 'Slack Channels',
    description: 'Join conversations',
  },
  {
    icon: BookOpen,
    label: 'Learning Resources',
    description: 'Training materials',
  },
  {
    icon: HelpCircle,
    label: 'Get Help',
    description: 'Contact support',
  },
];

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col items-start p-3 space-y-1"
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{action.description}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
