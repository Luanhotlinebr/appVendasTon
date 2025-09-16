import { Input } from "./_components/input";
import LogoForm from "../../assets/logo-jj.webp";
import { Link } from "react-router-dom";
import { Auth } from "../../api/auth/auth";
import { useState } from "react";
import * as React from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../components/ui/alert.tsx/index";
import cn from "classnames";
const auth = Auth.getInstance();
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
  const [loading, setLoading] = useState(false);
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

  async function loginUser(e: LoginProps) {
    setLoading(true);
    const data = auth
      .login(e.username, e.email, e.password)
      .then((res) => {
        console.log(res);
        setAlert({ ...alert, state: false });
      })
      .catch((error: Error) => {
        setAlert({ message: error.message, type: "error", state: true });
        console.log(alert.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
          onClick={() => loginUser(login)}
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
