import { Input } from "../Login/_components/input";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <div className="w-full flex flex-col mt-2 gap-2">
          <h1 className="text-3xl my-2">Recuperar a senha</h1>
          <label>Endereço de email:</label>
          <Input
            type="text"
            placeholder="Digite seu username ou endereço de email"
            className="border-1 border-[#27272760] rounded-md p-3 focus:outline-[#30a66d] "
          />
        </div>

        <button className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer">
          Resetar Senha
        </button>
        <Link to={"/"} className="mt-4">
          Voltar para login
        </Link>
      </div>
    </div>
  );
}
