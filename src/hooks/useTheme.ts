import { useEffect, useSyncExternalStore } from "react";

const subscribers = new Set<() => void>();
let initialized = false;

const getSnapshot = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
};

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const setTheme = (dark: boolean) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", dark);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  subscribers.forEach((callback) => callback());
};

const initializeTheme = () => {
  if (initialized || typeof window === "undefined") {
    return;
  }

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);

  setTheme(initialDark);
  initialized = true;
};

export const useTheme = () => {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  useEffect(() => {
    initializeTheme();
  }, []);

  const toggleTheme = () => {
    setTheme(!isDark);
  };

  return { isDark, toggleTheme };
};
