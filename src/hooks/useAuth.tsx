import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { observarAuth } from "@/src/services/auth";

interface AuthContextType {
  usuario: User | null;
  cargando: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargando: true,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const unsubscribe = observarAuth((user) => {
      setUsuario(user);
      setCargando(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}
