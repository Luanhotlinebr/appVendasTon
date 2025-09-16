import { Input } from "../Login/_components/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { Auth } from "@/api/auth/auth";
const auth = Auth.getInstance();
// Função utilitária para validar se o valor é um e-mail
export interface RecoverPasswordBody {
  email?: string;
  username?: string;
}

const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export function ForgotPassword() {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const email = isEmail(inputValue) ? inputValue : undefined;
  const username = !isEmail(inputValue) ? inputValue : undefined;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Enviando solicitação...");
    setError(false);

    // O código aqui vai enviar apenas o valor do input, sem o objeto.
    // O método 'sendPasswordResetEmail' na sua classe 'Auth' vai receber a string.
    try {
      await auth.sendPasswordResetEmail(username, email);

      setMessage("E-mail de recuperação enviado com sucesso.");
      setInputValue("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Um erro inesperado ocorreu.";
      setMessage(errorMessage);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full flex flex-col mt-2 gap-2">
            <h1 className="text-3xl my-2">Recuperar a senha</h1>
            <label htmlFor="email">Endereço de email ou username:</label>
            <Input
              id="email"
              type="text"
              placeholder="Digite seu username ou endereço de email"
              className="border-1 border-[#27272760] rounded-md p-3 focus:outline-[#30a66d]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer"
          >
            Resetar Senha
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              error ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <Link to={"/"} className="mt-4">
          Voltar para login
        </Link>
      </div>
    </div>
  );
}
