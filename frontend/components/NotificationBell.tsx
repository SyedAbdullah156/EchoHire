"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiTrash2, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const result = await res.json();
      if (res.ok) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Real-time WebSockets
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.hostname}:5050`;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "notification") {
            setNotifications(prev => [data.payload, ...prev]);
            toast.info(`New Alert: ${data.payload.title}`, {
              description: data.payload.message
            });
          }
        } catch (err) {
          console.error("WS parse error", err);
        }
      };

      ws.onopen = () => console.log("🔔 Notification Socket Connected");
      ws.onerror = (err) => console.error("WS Socket Error", err);

      return () => ws.close();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-read", { method: "PUT" });
      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications(notifications.filter((n) => n._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-12 flex items-center justify-center rounded-2xl bg-[#0d162a] border border-slate-800 transition-all relative ${
          unreadCount > 0 ? "text-blue-500" : "text-slate-500 hover:text-white"
        }`}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-[#0d162a] animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 sm:w-96 rounded-3xl bg-[#0d162a] border border-slate-800 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-surface-2/50">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Alerts</h4>
                <p className="text-[10px] text-text-muted font-bold mt-1">
                  {unreadCount} UNREAD NOTIFICATIONS
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/50">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-6 transition-colors hover:bg-surface-2/30 relative group ${
                      !notif.read ? "bg-blue-500/5" : ""
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm font-bold ${!notif.read ? "text-white" : "text-slate-300"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-text-muted font-medium mt-2">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-surface-2 border border-slate-800 mx-auto flex items-center justify-center text-slate-700">
                    <FiBell size={32} />
                  </div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 bg-surface-2/30 text-center">
                <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                  View All Activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
