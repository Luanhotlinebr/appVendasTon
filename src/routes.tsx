import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/RecoveryPassword";
import { NotFound } from "./pages/NotFound";
import { RegisterUser } from "./pages/RegisterUser";
import { PrivateRoute } from "./components/PrivateRoute";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/esqueci-minha-senha",
    element: <ForgotPassword />,
  },
  {
    path: "/user/register",
    element: <RegisterUser />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
