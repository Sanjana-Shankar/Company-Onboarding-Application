import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { MilestoneSection } from './MilestoneSection';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { Loader2, Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface OnboardingTimelineProps {
  userId: string;
}

export function OnboardingTimeline({ userId }: OnboardingTimelineProps) {
  const { milestones, isLoading, error, toggleTask, progress, completedTasksCount, totalTasksCount } = useOnboarding(userId);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading your onboarding path...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Your Onboarding Path</h2>
          <p className="text-sm text-muted-foreground">
            Personalized for Backend Engineers in the Payments team
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">
              {completedTasksCount} / {totalTasksCount} tasks
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Alert>
          <Target className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This path is based on what helped 80% of successful backend engineers in their first month.
          </AlertDescription>
        </Alert>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          {milestones.map((milestone) => (
            <MilestoneSection
              key={milestone.id}
              milestone={milestone}
              onToggleTask={toggleTask}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
