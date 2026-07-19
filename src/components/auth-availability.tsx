"use client";

import { createContext, useContext } from "react";

const AuthAvailabilityContext = createContext(false);

export function AuthAvailabilityProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <AuthAvailabilityContext.Provider value={enabled}>{children}</AuthAvailabilityContext.Provider>;
}

export function useAuthAvailability() {
  return useContext(AuthAvailabilityContext);
}
