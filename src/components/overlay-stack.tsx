"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef } from "react";

type OverlayStackValue = {
  register: (id: string, lockScroll: boolean) => void;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
};

const OverlayStackContext = createContext<OverlayStackValue | null>(null);

type BodySnapshot = {
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
  scrollY: number;
};

export function OverlayStackProvider({ children }: { children: React.ReactNode }) {
  const stack = useRef<Array<{ id: string; lockScroll: boolean }>>([]);
  const bodySnapshot = useRef<BodySnapshot | null>(null);

  const lockBody = useCallback(() => {
    if (bodySnapshot.current) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    bodySnapshot.current = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      scrollY,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth) body.style.paddingRight = `${scrollbarWidth}px`;
  }, []);

  const unlockBody = useCallback(() => {
    const snapshot = bodySnapshot.current;
    if (!snapshot) return;
    const body = document.body;
    body.style.overflow = snapshot.overflow;
    body.style.position = snapshot.position;
    body.style.top = snapshot.top;
    body.style.width = snapshot.width;
    body.style.paddingRight = snapshot.paddingRight;
    bodySnapshot.current = null;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const restore = () => window.scrollTo({ top: snapshot.scrollY, left: 0, behavior: "instant" });
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(() => {
        restore();
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  }, []);

  const register = useCallback((id: string, lockScroll: boolean) => {
    stack.current = stack.current.filter((item) => item.id !== id);
    stack.current.push({ id, lockScroll });
    if (lockScroll) lockBody();
  }, [lockBody]);

  const unregister = useCallback((id: string) => {
    stack.current = stack.current.filter((item) => item.id !== id);
    if (!stack.current.some((item) => item.lockScroll)) unlockBody();
  }, [unlockBody]);

  const isTop = useCallback((id: string) => stack.current.at(-1)?.id === id, []);

  useEffect(() => () => unlockBody(), [unlockBody]);

  const value = useMemo(() => ({ register, unregister, isTop }), [register, unregister, isTop]);
  return <OverlayStackContext.Provider value={value}>{children}</OverlayStackContext.Provider>;
}

export function useOverlayLayer(open: boolean, lockScroll = true) {
  const context = useContext(OverlayStackContext);
  const reactId = useId();
  const id = `overlay-${reactId}`;

  useEffect(() => {
    if (!open || !context) return;
    context.register(id, lockScroll);
    return () => context.unregister(id);
  }, [context, id, lockScroll, open]);

  const isTop = useCallback(() => context?.isTop(id) ?? true, [context, id]);
  return useMemo(() => ({ id, isTop }), [id, isTop]);
}
