import React from 'react';
import { Bell, X } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { NotificationPayload } from '../services/notification';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface NotificationCenterProps {
  notifications: NotificationPayload[];
  onClearAll: () => void;
  onDismiss: (notification: NotificationPayload) => void;
  className?: string;
}

function getPriorityColor(priority: NotificationPayload['priority']): string {
  switch (priority) {
    case 'high':
      return 'bg-destructive text-destructive-foreground';
    case 'normal':
      return 'bg-primary text-primary-foreground';
    case 'low':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function NotificationCenter({
  notifications,
  onClearAll,
  onDismiss,
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={className}
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClearAll();
                  setOpen(false);
                }}
              >
                Clear All
              </Button>
            )}
          </div>
          <Separator />
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center text-center">
            <div className="text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No notifications</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4 py-4">
              {notifications.map((notification) => (
                <div
                  key={notification.timestamp}
                  className="relative rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => onDismiss(notification)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.body}
                  </p>

                  {notification.data && (
                    <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                      <div className="font-medium">Details:</div>
                      <div className="mt-1 space-y-1">
                        {Object.entries(notification.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(notification.timestamp), 'PPpp')}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}