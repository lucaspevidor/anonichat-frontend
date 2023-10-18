"use client";

import { useContext, createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface IAuth {
  jwt: string | null,
  status: "authenticated" | "unauthenticated" | "loading",
  username: string | null,
  id: string | null,
}

interface IAuthContext {
  auth: IAuth
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>
  clearAuth: () => void;
}

const authInit: IAuth = { jwt: null, status: "unauthenticated", username: null, id: null };
const authContext = createContext<IAuthContext | null>(null);

export function AuthProvider(
  { children }: { children: React.ReactNode }
) {
  const [auth, setAuth] = useState<IAuth>({ ...authInit, status: "loading" });
  const [loaded, setLoaded] = useState(false);

  function clearAuth() {
    Cookies.remove("jwt", {
      domain: ".lucaspevidor.com"
    })
    setAuth(authInit);
  }

  useEffect(() => {
    const authStorage = localStorage.getItem("auth");
    if (authStorage) {
      const authObj = JSON.parse(authStorage);
      setAuth(authObj);
    } else {
      setAuth(authInit);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const authStr = JSON.stringify(auth);
    localStorage.setItem("auth", authStr)
  }, [auth, loaded]);

  return (
    <authContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </authContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(authContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}