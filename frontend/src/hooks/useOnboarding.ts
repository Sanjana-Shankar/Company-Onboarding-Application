import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { OnboardingMilestone } from '../types';

export function useOnboarding(userId: string) {
  const [milestones, setMilestones] = useState<OnboardingMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnboardingPath = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getOnboardingPath(userId);
      setMilestones(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load onboarding path');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOnboardingPath();
  }, [fetchOnboardingPath]);

  const toggleTask = useCallback(async (taskId: string) => {
    // Optimistically update UI
    setMilestones((prev) =>
      prev.map((milestone) => ({
        ...milestone,
        tasks: milestone.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );

    try {
      const task = milestones.flatMap((m) => m.tasks).find((t) => t.id === taskId);
      if (task) {
        await apiClient.updateTaskStatus(taskId, !task.completed);
      }
    } catch (err) {
      // Revert on error
      fetchOnboardingPath();
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, [milestones, fetchOnboardingPath]);

  const completedTasksCount = milestones.reduce(
    (acc, milestone) => acc + milestone.tasks.filter((t) => t.completed).length,
    0
  );

  const totalTasksCount = milestones.reduce(
    (acc, milestone) => acc + milestone.tasks.length,
    0
  );

  const progress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  return {
    milestones,
    isLoading,
    error,
    toggleTask,
    progress,
    completedTasksCount,
    totalTasksCount,
    refetch: fetchOnboardingPath,
  };
}
