"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Popout } from "./popout";
import {
  Bell,
  CalendarCheck,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: typeof Bell;
  color: string;
  bg: string;
  unread: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Booking confirmed",
    message: "Your stay at Kigali Heights Residence is confirmed for Oct 12 – 16.",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-[var(--rwanda-green)]",
    bg: "bg-[var(--green-light)]",
    unread: true,
  },
  {
    id: "2",
    title: "New message from host",
    message:
      "Hi! We're looking forward to hosting you next week. Let me know if you need airport transfer or early check-in.",
    time: "1 day ago",
    icon: MessageSquare,
    color: "text-[var(--gold-deep)]",
    bg: "bg-[var(--gold-pale)]",
    unread: true,
  },
  {
    id: "3",
    title: "Check-in instructions ready",
    message: "Your access code for the smart lock has been generated. Open your booking to view it.",
    time: "3 days ago",
    icon: KeyRound,
    color: "text-[var(--gold-deep)]",
    bg: "bg-[var(--gold-pale)]",
    unread: false,
  },
  {
    id: "4",
    title: "Payment processed",
    message: "We've successfully recorded your stay deposit. No further action is needed.",
    time: "1 week ago",
    icon: CreditCard,
    color: "text-[var(--ink)]",
    bg: "bg-[var(--parchment)]",
    unread: false,
  },
  {
    id: "5",
    title: "Seasonal offer nearby",
    message: "10% off midweek stays in Kibagabaga this month — limited residences.",
    time: "1 week ago",
    icon: Tag,
    color: "text-[var(--gold-deep)]",
    bg: "bg-[var(--gold-pale)]",
    unread: true,
  },
  {
    id: "6",
    title: "Safety reminder",
    message: "Review guest house rules and emergency contacts before arrival.",
    time: "2 weeks ago",
    icon: ShieldCheck,
    color: "text-[var(--rwanda-green)]",
    bg: "bg-[var(--green-light)]",
    unread: false,
  },
  {
    id: "7",
    title: "Dates soft-held",
    message: "Your requested dates at Rebecca’s Apartment are held for 24 hours while the host reviews.",
    time: "2 weeks ago",
    icon: CalendarCheck,
    color: "text-[var(--ink)]",
    bg: "bg-[var(--mist)]",
    unread: false,
  },
  {
    id: "8",
    title: "Welcome to StayRwanda",
    message: "Save residences, track bookings, and manage alerts from your account.",
    time: "3 weeks ago",
    icon: Sparkles,
    color: "text-[var(--gold-deep)]",
    bg: "bg-[var(--gold-pale)]",
    unread: false,
  },
];

export function NotificationPopout({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const listRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const visible = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => n.unread) : notifications),
    [filter, notifications],
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const trigger = (
    <div
      onClick={() => setOpen(!open)}
      className={`relative flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-colors md:min-w-[4.25rem] md:px-2 ${
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
      }`}
      aria-label={`Alerts, ${unreadCount} unread updates`}
    >
      <span className="relative grid size-9 place-items-center md:size-auto">
        <Bell size={18} className="shrink-0 opacity-90 md:size-4" />
        {unreadCount > 0 && (
          <span className="notification-dot absolute right-1 top-1 md:-right-0.5 md:-top-0.5" />
        )}
      </span>
      <span className="hidden text-[11px] font-semibold leading-none tracking-wide md:block">
        {unreadCount > 0 ? unreadCount : "Alerts"}
      </span>
      <span
        className={`hidden text-[9px] font-medium uppercase leading-none tracking-[0.12em] md:block ${
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
      mobileVariant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Notifications"
      className="flex h-full max-h-[100dvh] w-full flex-col bg-white sm:w-[420px]"
    >
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--line)] bg-[var(--parchment)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {unreadCount > 0 ? `${unreadCount} unread` : "You’re all caught up"}
            </p>
            <p className="text-[11px] text-[var(--muted)]">{notifications.length} total updates</p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] transition-colors hover:text-[var(--ink)]"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        <div className="flex gap-2 px-4 pb-3">
          {(
            [
              ["all", "All"],
              ["unread", "Unread"],
            ] as const
          ).map(([id, label]) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setFilter(id);
                  requestAnimationFrame(scrollToTop);
                }}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "bg-[var(--ink)] text-white shadow-sm"
                    : "bg-white text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {label}
                {id === "unread" && unreadCount > 0 ? ` · ${unreadCount}` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={listRef}
        className="notification-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]">
              <Bell size={22} />
            </span>
            <p className="mt-4 font-serif text-xl font-semibold text-[var(--ink)]">No notifications</p>
            <p className="mt-1 max-w-[240px] text-sm text-[var(--muted)]">
              {filter === "unread"
                ? "You have no unread alerts right now."
                : "Updates about bookings and messages will appear here."}
            </p>
            {filter === "unread" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] hover:underline"
              >
                View all
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)] pb-4">
            {visible.map((n) => {
              const Icon = n.icon;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => markOneRead(n.id)}
                    className={`flex w-full gap-4 p-5 text-left transition-colors hover:bg-[var(--parchment)] ${
                      n.unread ? "bg-[var(--gold-pale)]/35" : "bg-white"
                    }`}
                  >
                    <div className={`grid size-10 shrink-0 place-items-center rounded-full ${n.bg} ${n.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm leading-snug ${
                            n.unread ? "font-bold text-[var(--ink)]" : "font-medium text-[var(--ink)]"
                          }`}
                        >
                          {n.title}
                        </h4>
                        {n.unread && (
                          <span
                            className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--gold)]"
                            title="Unread"
                          />
                        )}
                      </div>
                      <p
                        className={`mt-1 line-clamp-3 text-sm leading-relaxed ${
                          n.unread ? "text-[var(--ink)]/85" : "text-[var(--muted)]"
                        }`}
                      >
                        {n.message}
                      </p>
                      <span className="mt-2 block text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
                        {n.time}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {visible.length > 0 && (
        <div className="shrink-0 border-t border-[var(--line)] bg-white px-4 py-3">
          <button
            type="button"
            onClick={scrollToTop}
            className="w-full text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--gold-deep)]"
          >
            Back to top
          </button>
        </div>
      )}
    </Popout>
  );
}
