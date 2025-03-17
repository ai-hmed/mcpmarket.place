"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bell, X } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/use-notifications";

export default function NotificationToast() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  } = useNotifications();

  const formatTime = (date: Date | string) => {
    try {
      // Ensure we have a valid date object
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return "Unknown time";
      }

      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - dateObj.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 24 * 60)
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  // Already getting unreadCount from useNotifications hook

  return (
    <div className="relative">
      <button
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-border hover:bg-muted/50 ${!notification.read ? "bg-muted/20" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <div
                        className={`mt-1 h-2 w-2 rounded-full ${getTypeColor(notification.type)}`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {!notification.read && (
                    <button
                      className="text-xs text-blue-500 hover:text-blue-700 mt-2"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-border text-center">
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowNotifications(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
