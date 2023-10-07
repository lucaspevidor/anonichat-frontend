"use client";

import { useContext, createContext, useState, useEffect } from "react";

export interface IAuth {
  jwt: string | null,
  status: "authenticated" | "unauthenticated" | "loading",
  username: string | null,
}

interface IAuthContext {
  auth: IAuth
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>
  clearAuth: () => void;
}

const authContext = createContext<Partial<IAuthContext>>({});

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider(
  {children} : {children: React.ReactNode}
) {
  const [auth, setAuth] = useState<IAuth>({jwt: null, status: "loading", username: null});
  const [loaded, setLoaded] = useState(false);

  function clearAuth() {
    setAuth({jwt: null, status: "unauthenticated", username: null});
  }

  useEffect(() => {
    console.log("Retrieving auth obj");
    console.log({status: auth.status});
    const authStorage = localStorage.getItem("auth");
    if (authStorage) {
      const authObj = JSON.parse(authStorage);
      setAuth(authObj);
    } else {
      setAuth({jwt: null, status: "unauthenticated", username: null});
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    console.log("Setting auth obj")
    console.log({status: auth.status});
    const authStr = JSON.stringify(auth);
    localStorage.setItem("auth", authStr)
  }, [auth, loaded]);

  return (
    <authContext.Provider value={{auth, setAuth, clearAuth}}>
      {children}
    </authContext.Provider>
  )
}