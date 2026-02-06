import { Card } from '../ui/card';
import { InsightCard } from './InsightCard';
import { ScrollArea } from '../ui/scroll-area';
import { Sparkles } from 'lucide-react';
import type { OnboardingInsight } from '../../../types';

interface InsightsListProps {
  insights: OnboardingInsight[];
}

const mockInsights: OnboardingInsight[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Most engineers schedule their first deployment shadowing in week 2',
    description:
      'Watching a senior engineer deploy helps you understand the process before doing it yourself. Book time with Marcus or Sarah.',
    basedOn: '78% of successful backend engineers',
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Join the #payments-daily Slack channel',
    description:
      'This is where the team shares daily updates and asks quick questions. New engineers who joined this channel felt more connected to the team.',
    basedOn: '85% of new team members',
  },
  {
    id: '3',
    type: 'warning',
    title: 'VPN access can take 24-48 hours to provision',
    description:
      'Request your VPN access early if you need to work from home. This is a common blocker in week 1.',
    basedOn: 'Common issue identified',
  },
];

export function InsightsList({ insights = mockInsights }: InsightsListProps) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Insights for You</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Based on successful hires in similar roles
      </p>
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
