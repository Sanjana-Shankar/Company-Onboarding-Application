import { differenceInDays, format, formatDistanceToNow } from 'date-fns';

/**
 * Format a date relative to now (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a date in a standard format
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Calculate days in role
 */
export function getDaysInRole(startDate: Date | string): number {
  const dateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  return differenceInDays(new Date(), dateObj);
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Format task completion rate
 */
export function formatCompletionRate(rate: number): string {
  return `${rate}% of people completed this`;
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-blue-500/10 text-blue-700 border-blue-200',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    high: 'bg-red-500/10 text-red-700 border-red-200',
  };
  return colors[priority];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const names: Record<string, string> = {
    engineer: 'Engineer',
    sales: 'Sales',
    ops: 'Operations',
    manager: 'Manager',
    other: 'Other',
  };
  return names[role] || role;
}

/**
 * Get seniority display name
 */
export function getSeniorityDisplayName(seniority: string): string {
  const names: Record<string, string> = {
    junior: 'Junior',
    mid: 'Mid-level',
    senior: 'Senior',
    staff: 'Staff',
    principal: 'Principal',
  };
  return names[seniority] || seniority;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format large numbers (e.g., 1000 -> 1k)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
