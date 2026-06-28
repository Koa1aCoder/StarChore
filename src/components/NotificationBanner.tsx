"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NotificationBanner() {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(true);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => base44.entities.Notification.list(),
    refetchInterval: 3000, // Refetch every 3 seconds to catch new notifications
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unread = notifications.filter((n: any) => !n.is_read);
  const latestNotification = unread[0];

  useEffect(() => {
    if (unread.length > 0) {
      setVisible(true);
    }
  }, [unread.length]);

  if (!visible || !latestNotification) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 shadow-lg animate-in slide-in-from-top">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bell className="h-5 w-5 flex-shrink-0 animate-bounce" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{latestNotification.kid_name}</p>
            <p className="text-sm opacity-90 truncate">{latestNotification.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-blue-700 hover:text-white"
            onClick={() => {
              markAsRead.mutate(latestNotification.id);
              if (unread.length === 1) {
                setVisible(false);
              }
            }}
          >
            Dismiss
          </Button>
          <button
            onClick={() => {
              markAsRead.mutate(latestNotification.id);
              if (unread.length === 1) {
                setVisible(false);
              }
            }}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
