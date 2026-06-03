import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BADGES, INITIAL_PICKUPS } from "../constants/data";

const AppContext = createContext(null);

const USER_KEY = "kabadiwala_user";

export function AppProvider({ children }) {
  // Restore user from localStorage for session persistence
  const [user, setUserState]  = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [points,  setPoints]  = useState(120);
  const [pickups, setPickups] = useState(INITIAL_PICKUPS);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError,   setAuthError]   = useState(null);

  // Persist user to localStorage whenever it changes
  const setUser = useCallback((u) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else    localStorage.removeItem(USER_KEY);
    } catch { /* storage quota */ }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
  }, [setUser]);

  const addPickup = (pickup) => {
    const p = {
      ...pickup,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      status: "Scheduled",
      pointsAwarded: 50,
    };
    setPickups((prev) => [p, ...prev]);
    setPoints((prev) => prev + 50);
  };

  const badges = BADGES(points, pickups.length);

  return (
    <AppContext.Provider value={{
      user, setUser, logout,
      authLoading, setAuthLoading,
      authError, setAuthError,
      points, setPoints,
      pickups, addPickup,
      badges,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
