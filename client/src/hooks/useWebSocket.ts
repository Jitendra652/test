import { useEffect, useRef, useState } from 'react';
import { authStorage } from '@/lib/auth';
import { Notification } from '@/types';

export function useWebSocket() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    const token = authStorage.getToken();
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const hostname = window.location.hostname;
    const port = window.location.port || '5000'; // Default to 5000 if port is not specified
    const wsUrl = `${protocol}//${hostname}:${port}/ws?token=${token}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        setNotifications(prev => [
          { ...notification, id: Date.now().toString(), timestamp: new Date().toISOString() },
          ...prev.slice(0, 9) // Keep only 10 most recent
        ]);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (authStorage.getToken()) {
          connect();
        }
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    isConnected,
    removeNotification,
    clearNotifications,
  };
}
