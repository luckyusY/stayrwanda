"use client";

import { useState } from "react";
import { Popout } from "./popout";
import { Bell, KeyRound, MessageSquare, CreditCard, CheckCircle2 } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Booking confirmed",
    message: "Your stay at Kigali Heights Residence is confirmed for Oct 12 - 16.",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    unread: true,
  },
  {
    id: "2",
    title: "New message from host",
    message: "Hi! We're looking forward to hosting you next week. Let me know if you need airport transfer...",
    time: "1 day ago",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    unread: true,
  },
  {
    id: "3",
    title: "Check-in instructions ready",
    message: "Your access code for the smart lock has been generated.",
    time: "3 days ago",
    icon: KeyRound,
    color: "text-[var(--gold-deep)]",
    bg: "bg-[var(--gold-pale)]",
    unread: false,
  },
  {
    id: "4",
    title: "Payment processed",
    message: "We've successfully processed your payment for $450.00.",
    time: "1 week ago",
    icon: CreditCard,
    color: "text-[var(--ink)]",
    bg: "bg-[var(--parchment)]",
    unread: false,
  },
];

export function NotificationPopout({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const trigger = (
    <div
      onClick={() => setOpen(!open)}
      className={`relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors cursor-pointer ${
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
      }`}
      aria-label={`Alerts, ${unreadCount} unread updates`}
    >
      <span className="relative">
        <Bell size={16} className="shrink-0 opacity-90" />
        {unreadCount > 0 && <span className="notification-dot absolute -right-0.5 -top-0.5" />}
      </span>
      <span className="text-[11px] font-semibold leading-none tracking-wide">
        {unreadCount > 0 ? unreadCount : "Alerts"}
      </span>
      <span
        className={`text-[9px] font-medium uppercase tracking-[0.12em] leading-none ${
          light ? "text-white/55" : "text-[var(--muted)]"
        }`}
      >
        Updates
      </span>
    </div>
  );

  return (
    <Popout
      variant="sheet"
      isOpen={open}
      onClose={() => setOpen(false)}
      trigger={trigger}
      title="Notifications"
      className="w-full sm:w-[420px] bg-white"
    >
      <div className="p-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--parchment)]">
        <span className="text-sm font-medium text-[var(--ink)]">{unreadCount} unread</span>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold text-[var(--gold-deep)] hover:underline uppercase tracking-wider">
            Mark all read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-[var(--line)]">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className={`p-5 transition-colors hover:bg-[var(--parchment)] ${n.unread ? "bg-[#fcfbf9]" : "bg-white"}`}>
              <div className="flex gap-4">
                <div className={`grid size-10 shrink-0 place-items-center rounded-full ${n.bg} ${n.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm ${n.unread ? "font-bold text-[var(--ink)]" : "font-medium text-[var(--ink)]"}`}>
                      {n.title}
                    </h4>
                    {n.unread && <span className="size-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </div>
                  <p className={`mt-1 text-sm ${n.unread ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
                    {n.message}
                  </p>
                  <span className="mt-2 block text-xs text-[var(--muted)]">{n.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Popout>
  );
}
