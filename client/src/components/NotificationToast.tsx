import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';

export function NotificationToast() {
  const { notifications, removeNotification, clearNotifications } = useWebSocket();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast for new notifications
    notifications.forEach(notification => {
      if (notification.timestamp && Date.now() - new Date(notification.timestamp).getTime() < 5000) {
        toast({
          title: notification.title,
          description: notification.message,
        });
      }
    });
  }, [notifications, toast]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2" data-testid="notification-container">
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm animate-fade-in"
          data-testid={`notification-${notification.id}`}
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-card-foreground text-sm">{notification.title}</h5>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0"
              data-testid={`button-close-notification-${notification.id}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      
      {notifications.length > 3 && (
        <div className="bg-card border border-border rounded-lg p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearNotifications}
            className="text-xs"
            data-testid="button-clear-notifications"
          >
            Clear all ({notifications.length})
          </Button>
        </div>
      )}
    </div>
  );
}
