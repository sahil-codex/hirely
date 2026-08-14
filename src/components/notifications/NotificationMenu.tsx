"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationMenu() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  async function loadNotifications() {
    try {
      const res = await fetch(
        "/api/notifications",
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setNotifications(
        data.notifications ?? []
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(
      loadNotifications,
      30000
    );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function markAsRead(
    notificationId: string
  ) {
    try {
      const res = await fetch(
        `/api/notifications/${notificationId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setNotifications(
        (current) =>
          current.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  read: true,
                }
              : notification
          )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch(
        "/api/notifications",
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setNotifications(
        (current) =>
          current.map((notification) => ({
            ...notification,
            read: true,
          }))
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 transition hover:bg-white/5"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h3 className="font-semibold">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="text-xs text-zinc-400">
                  {unreadCount} unread
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell
                  size={28}
                  className="mx-auto mb-3 text-zinc-500"
                />

                <p className="text-sm text-zinc-400">
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      !notification.read &&
                      markAsRead(
                        notification.id
                      )
                    }
                    className={`w-full border-b border-border px-4 py-4 text-left transition hover:bg-white/5 ${
                      !notification.read
                        ? "bg-primary/5"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          notification.read
                            ? "bg-transparent"
                            : "bg-primary"
                        }`}
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-zinc-500">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}