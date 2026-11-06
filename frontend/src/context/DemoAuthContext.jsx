"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "flowspace-demo-user";

export const demoUser = {
  id: "demo-bhuwan",
  name: "Bhuwan Sharma",
  username: "bhuwan",
  email: "demo@flowspace.app",
  role: "Designer",
  bio: "I turn complicated ideas into clear, useful visual stories.",
  location: "Bengaluru, India",
  website: "flowspace.app",
  joinedAt: "October 2026",
};

const DemoAuthContext = createContext(null);

function wait(duration = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function firstNameFromEmail(email) {
  const localPart = email.split("@")[0] || "FlowSpace user";

  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function saveUser(nextUser) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }
}

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const restoreSession = window.setTimeout(() => {
      try {
        const storedUser = window.localStorage.getItem(STORAGE_KEY);

        if (storedUser) {
          setUser({ ...demoUser, ...JSON.parse(storedUser) });
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsReady(true);
      }

    }, 0);

    return () => window.clearTimeout(restoreSession);
  }, []);

  const signIn = useCallback(async ({ email, name } = {}) => {
    await wait();

    const normalizedEmail = email?.trim().toLowerCase() || demoUser.email;
    const nextUser = {
      ...demoUser,
      email: normalizedEmail,
      name: name?.trim() || (normalizedEmail === demoUser.email
        ? demoUser.name
        : firstNameFromEmail(normalizedEmail)),
      username: normalizedEmail === demoUser.email
        ? demoUser.username
        : normalizedEmail.split("@")[0].replace(/[^a-z0-9_]/gi, ""),
    };

    setUser(nextUser);
    saveUser(nextUser);

    return nextUser;
  }, []);

  const register = useCallback(async ({ name, username, email } = {}) => {
    await wait(600);

    const nextUser = {
      ...demoUser,
      id: `demo-${username?.trim().toLowerCase() || "member"}`,
      name: name?.trim() || demoUser.name,
      username: username?.trim() || demoUser.username,
      email: email?.trim().toLowerCase() || demoUser.email,
      joinedAt: "Today",
    };

    setUser(nextUser);
    saveUser(nextUser);

    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProfile = useCallback(async (updates = {}) => {
    await wait(350);

    let nextUser;

    setUser((currentUser) => {
      nextUser = { ...demoUser, ...currentUser, ...updates };
      saveUser(nextUser);
      return nextUser;
    });

    return nextUser;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isReady,
    signIn,
    register,
    signOut,
    updateProfile,
  }), [isReady, register, signIn, signOut, updateProfile, user]);

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);

  if (!context) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider.");
  }

  return context;
}
