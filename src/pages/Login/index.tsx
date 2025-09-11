import { Input } from "./_components/input";
import LogoForm from "../../assets/logo-jj.webp";
import { Link } from "react-router-dom";

export function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <img src={LogoForm} loading="lazy" alt="" width={200} />
        <div className="w-full flex flex-col mt-6 gap-2">
          <label>Endereço de email ou usuário:</label>
          <Input
            type="text"
            placeholder="Digite seu email ou usuário"
            className="border-1 border-[#27272760] rounded-md p-3 focus:outline-[#30a66d] "
          />
        </div>

        <div className=" w-full flex flex-col mt-6 gap-2">
          <label>Senha:</label>
          <Input
            type="text"
            placeholder="Digite sua senha"
            className="border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
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
          className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
