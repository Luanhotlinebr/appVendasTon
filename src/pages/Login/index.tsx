import cn from "classnames";
import { Input } from "./_components/input";
import LogoForm from "../../assets/logo-jj.webp";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as React from "react";

import { useAuth } from "@/contexts/AuthContext";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../components/ui/alert.tsx";

// const auth = Auth.getInstance();

interface LoginProps {
  username?: string;
  email?: string;
  password?: string;
}
interface Alert {
  type?: string;
  message: string;
  state?: boolean;
}

export function Login() {
  const { login: performLogin, loading } = useAuth();
  const navigate = useNavigate(); // Chame o hook aqui, dentro do componente
  const [login, setLogin] = useState<LoginProps>({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const [alert, setAlert] = useState<Alert>({
    message: "",
    type: "",
    state: false,
  });

  const handleUsernameOrEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
      setLogin({ ...login, email: value, username: "" });
    } else {
      setLogin({ ...login, username: value, email: "" });
    }
  };

  async function handleLogin() {
    try {
      setAlert({ ...alert, state: false });
      await performLogin(navigate, login.username, login.email, login.password);
    } catch (error: any) {
      setAlert({ message: error.message, type: "error", state: true });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <img src={LogoForm} loading="lazy" alt="" width={200} />
        <div className="w-full flex flex-col mt-6 gap-2 ">
          {alert.state && (
            <Alert variant={"destructive"}>
              <AlertTitle>{<h1>Eita!</h1>}</AlertTitle>
              <AlertDescription>{<h1>{alert.message}</h1>}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="w-full flex flex-col mt-6 gap-2">
          <label>Endereço de email ou usuário:</label>
          <Input
            type="text"
            placeholder="Digite seu email ou usuário"
            className="border-1 border-[#27272760] rounded-md p-3 focus:outline-[#30a66d]"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleUsernameOrEmail(e.target.value)
            }
          />
        </div>

        <div className=" w-full flex flex-col mt-6 gap-2">
          <label>Senha:</label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            className={
              "border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLogin({ ...login, password: e.target.value })
            }
          />
        </div>
        <div className="flex justify-start w-full mt-3">
          <Link
            to={"/esqueci-minha-senha"}
            className="text-[#1b422f] hover:underline cursor-pointer"
          >
            Esqueci minha senha
          </Link>
        </div>
        <button
          type="submit"
          className={cn(
            "bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer",
            {
              "bg-[#d1dbd6] w-full p-3 rounded-md text-gray mt-6 cursor-progress":
                loading,
            }
          )}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}

//       { className={cn(
//   "px-4 py-2 rounded-md text-white transition-colors",
//   {
//     "bg-blue-500 hover:bg-blue-600": active,
//     "bg-gray-400 hover:bg-gray-500": !active,
//   }
// )}}
