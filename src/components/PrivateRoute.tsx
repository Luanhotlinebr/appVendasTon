import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mdiLogout } from "@mdi/js";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full items-center">
        <div className="flex flex-row space-x-6 p-6 justify-between items-center">
          <div className="flex  gap-3 mx-2">
            {/*Side bar icone tem que ficar aqui*/}
            <div className="flex flex-row cursor-pointer">
              <SidebarTrigger className="cursor-pointer"></SidebarTrigger>
              <Icon path={mdiAccount} size={1} className="mx-2" />
              <p>Usuário</p>
            </div>
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
    </SidebarProvider>
  );
}
