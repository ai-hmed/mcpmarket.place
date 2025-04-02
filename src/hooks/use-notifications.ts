"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, read: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, you would make a batch update API call
      // For now, we'll just update each notification individually
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read,
      );

      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }

      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Update local state
      setNotifications(
        notifications.filter((notification) => notification.id !== id),
      );

      return true;
    } catch (err) {
      console.error("Error deleting notification:", err);
      return false;
    }
  };

  // Set up real-time notifications with Supabase
  useEffect(() => {
    const setupRealtimeNotifications = async () => {
      try {
        const supabase = createClient();

        // Subscribe to notifications table changes
        const channel = supabase
          .channel("notifications-changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
            },
            (payload) => {
              // Add new notification to state
              const newNotification = payload.new as any;
              setNotifications((prev) => [
                {
                  id: newNotification.id,
                  title: newNotification.title,
                  message: newNotification.message,
                  type: newNotification.type as
                    | "info"
                    | "success"
                    | "warning"
                    | "error",
                  read: newNotification.read,
                  timestamp: new Date(newNotification.created_at),
                },
                ...prev,
              ]);
            },
          )
          .subscribe();

        // Cleanup subscription on unmount
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up realtime notifications:", error);
      }
    };

    setupRealtimeNotifications();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount: notifications.filter((notification) => !notification.read)
      .length,
  };
}
