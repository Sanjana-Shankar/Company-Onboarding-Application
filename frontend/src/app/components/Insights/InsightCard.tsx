import { Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { OnboardingInsight } from '../../../types';

interface InsightCardProps {
  insight: OnboardingInsight;
}

const iconMap = {
  tip: Lightbulb,
  warning: AlertTriangle,
  recommendation: Sparkles,
};

const colorMap = {
  tip: 'bg-blue-500/10 text-blue-700 border-blue-200',
  warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  recommendation: 'bg-purple-500/10 text-purple-700 border-purple-200',
};

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.type];

  return (
    <Card className={`p-4 ${colorMap[insight.type]}`}>
      <div className="flex gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium">{insight.title}</h4>
            <Badge variant="outline" className="text-xs capitalize">
              {insight.type}
            </Badge>
          </div>
          <p className="text-sm">{insight.description}</p>
          {insight.basedOn && (
            <p className="text-xs opacity-75">Based on: {insight.basedOn}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
