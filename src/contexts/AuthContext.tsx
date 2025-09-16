// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { Auth as ApiAuth } from "../api/auth/auth";
import { useNavigate } from "react-router-dom";

const authApi = ApiAuth.getInstance();

// Tipos
interface UserData {
  token: string;
  refreshToken: string;
  expiresIn: number;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (
    navigate: ReturnType<typeof useNavigate>, // Adicione o tipo de navigate
    username?: string,
    email?: string,
    password?: string
  ) => Promise<void>;
  logout: (navigate: ReturnType<typeof useNavigate>) => void; // Adicione o tipo de navigate
  loading: boolean;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para fazer login
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

      setUser(userData); // Armazena o usuário diretamente no estado
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = (navigate: ReturnType<typeof useNavigate>) => {
    setUser(null); // Limpa o estado do usuário
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
