"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, title: string, description?: string, duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, title, description, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (title: string, description?: string) => addToast("success", title, description),
    error: (title: string, description?: string) => addToast("error", title, description),
    info: (title: string, description?: string) => addToast("info", title, description),
    warning: (title: string, description?: string) => addToast("warning", title, description),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-stack">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const Icon = {
    success: CheckCircle,
    error: AlertOctagon,
    info: Info,
    warning: AlertTriangle,
  }[toast.type];

  const colorClass = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className={`toast ${toast.type}`}
      role="alert"
    >
      <Icon className={`size-5 mt-0.5 shrink-0 ${colorClass}`} />
      <div className="flex-1 min-w-0">
        <strong className="block text-sm font-semibold text-[var(--ink)] leading-tight">
          {toast.title}
        </strong>
        {toast.description && (
          <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="size-6 shrink-0 grid place-items-center rounded hover:bg-[var(--parchment)] transition-colors text-[var(--muted)] hover:text-[var(--ink)]"
        aria-label="Close message"
      >
        <X size={14} />
      </button>
      <div
        className="toast-progress"
        style={{ "--dismiss-duration": `${toast.duration || 4000}ms` } as React.CSSProperties}
      />
    </motion.div>
  );
}
