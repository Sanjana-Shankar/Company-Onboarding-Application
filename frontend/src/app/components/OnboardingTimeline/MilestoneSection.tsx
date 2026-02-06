import { CheckCircle2, Circle } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { TaskCard } from './TaskCard';
import type { OnboardingMilestone } from '../../../types';

interface MilestoneSectionProps {
  milestone: OnboardingMilestone;
  onToggleTask: (taskId: string) => void;
}

export function MilestoneSection({ milestone, onToggleTask }: MilestoneSectionProps) {
  const completedTasks = milestone.tasks.filter((t) => t.completed).length;
  const totalTasks = milestone.tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {milestone.completed ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {completedTasks} of {totalTasks} tasks completed
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3 pl-9">
        {milestone.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
