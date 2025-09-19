// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { Auth as ApiAuth } from "../api/auth";
import { useNavigate } from "react-router-dom";

const authApi = ApiAuth.getInstance();

interface UserData {
  token: string;
  refreshToken: string;
  expiresIn: number;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (
    navigate: ReturnType<typeof useNavigate>,
    username?: string,
    email?: string,
    password?: string
  ) => Promise<void>;
  logout: (navigate: ReturnType<typeof useNavigate>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Função auxiliar para buscar os dados do localStorage
// O try/catch é importante para evitar erros caso os dados estejam corrompidos
const getStoredUser = (): UserData | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário do localStorage", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Inicializa o estado do usuário com a função que busca dados no localStorage
  const [user, setUser] = useState<UserData | null>(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = async (
    navigate: ReturnType<typeof useNavigate>,
    username?: string,
    email?: string,
    password?: string
  ) => {
    try {
      setLoading(true);
      const res = await authApi.login(username, email, password);

      const userData = {
        token: res.idToken,
        refreshToken: res.refreshToken,
        expiresIn: res.expiresIn,
        email: res.email,
      };

      // Salva os dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const logout = (navigate: ReturnType<typeof useNavigate>) => {
    setUser(null);
    // Remove os dados do usuário do localStorage
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
