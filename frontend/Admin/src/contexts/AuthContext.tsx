import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  admin: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<{ email: string; name: string } | null>(() => {
    const stored = sessionStorage.getItem("lumina_admin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // Dummy auth — accepts admin@luminallearn.com / admin123
    await new Promise((r) => setTimeout(r, 500));
    if (email === "admin@luminallearn.com" && password === "admin123") {
      const user = { email, name: "Admin User" };
      setAdmin(user);
      sessionStorage.setItem("lumina_admin", JSON.stringify(user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    sessionStorage.removeItem("lumina_admin");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!admin, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
