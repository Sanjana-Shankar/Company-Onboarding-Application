import { CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import type { OnboardingTask } from '../../../types';

interface TaskCardProps {
  task: OnboardingTask;
  onToggle: () => void;
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-700 border-blue-200',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    high: 'bg-red-500/10 text-red-700 border-red-200',
  };

  return (
    <Card
      className={`p-4 transition-all hover:shadow-md ${
        task.completed ? 'opacity-60 bg-muted/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1"
          id={task.id}
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <label
              htmlFor={task.id}
              className={`font-medium cursor-pointer ${
                task.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </label>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{task.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {task.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.estimatedTime}</span>
              </div>
            )}
            
            {task.completionRate !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{task.completionRate}% complete this by now</span>
              </div>
            )}
            
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
