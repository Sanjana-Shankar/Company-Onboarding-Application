import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  helpful: boolean;
}

export function FeedbackDialog({ open, onOpenChange, messageId, helpful }: FeedbackDialogProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit feedback with comment
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Thank you for your feedback!');
      onOpenChange(false);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {helpful ? 'Tell us what was helpful' : 'Help us improve'}
          </DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the onboarding experience for everyone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="feedback">Additional comments (optional)</Label>
          <Textarea
            id="feedback"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              helpful
                ? 'What made this response helpful?'
                : 'What could be improved?'
            }
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
