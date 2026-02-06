import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import type { User } from '../../../types';
import { differenceInDays, format } from 'date-fns';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const daysInRole = differenceInDays(new Date(), new Date(user.startDate));
  const startDateFormatted = format(new Date(user.startDate), 'MMM d, yyyy');

  const roleColors: Record<string, string> = {
    engineer: 'bg-blue-500/10 text-blue-700 border-blue-200',
    sales: 'bg-green-500/10 text-green-700 border-green-200',
    ops: 'bg-orange-500/10 text-orange-700 border-orange-200',
    manager: 'bg-purple-500/10 text-purple-700 border-purple-200',
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={roleColors[user.role]}>
              {user.role}
            </Badge>
            <Badge variant="outline">{user.seniority}</Badge>
            {user.department && (
              <Badge variant="outline">{user.department}</Badge>
            )}
            <Badge variant="secondary">
              Day {daysInRole} • Started {startDateFormatted}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
