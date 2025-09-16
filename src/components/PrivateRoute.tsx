import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // Aqui você poderia pegar o usuário de um Context ou de um estado global
  const user = localStorage.getItem("user"); // Exemplo simples

  if (!user) {
    return <Navigate to="/login" replace />; // Redireciona para login se não estiver autenticado
  }
  return (
    <div>
      <p>Cara de cu</p>
      {children}
    </div>
  );
}
