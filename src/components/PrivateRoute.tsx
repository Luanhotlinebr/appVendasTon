import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mdiLogout } from "@mdi/js";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  function handleLogout() {
    logout(navigate);
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redireciona para login se não estiver autenticado
  }
  return (
    <div className="w-full items-center">
      <div className="flex flex-row space-x-6 p-6 justify-between items-center">
        <div className="flex flex-row gap-3">
          <Icon path={mdiAccount} size={1} />
          <p>Usuário</p>
        </div>

        <button
          className="bg-transparent  p-3 rounded-md text-white cursor-pointer"
          onClick={handleLogout}
        >
          <Icon path={mdiLogout} size={1} className="text-black" />
        </button>
      </div>
      {children}
    </div>
  );
}
