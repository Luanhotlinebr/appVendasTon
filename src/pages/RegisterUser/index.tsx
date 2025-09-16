import { Input } from "../Login/_components/input";
import Icon from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";
import { useState } from "react";
import { Auth } from "../../api/auth/auth";

interface RegisterProps {
  email: string;
  password: string;
  nome: string;
  username: string;
  profile: "admin" | "user";
}
const auth = Auth.getInstance();

export function RegisterUser() {
  const [newUser, setNewUser] = useState<RegisterProps>({
    email: "",
    password: "",
    nome: "",
    username: "",
    profile: "user", // perfil padrão
  });

  const profiles = [
    { value: "admin", name: "Admnistrador" },
    { value: "user", name: "Agente" },
  ];

  async function cadastrarUsuario(e: RegisterProps) {
    const data = await auth.register(
      e.email,
      e.password,
      e.nome,
      e.username,
      e.profile
    );
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <div className="w-full flex flex-col sm:flex-row mt-6 gap-2">
          <div className=" w-full flex flex-col mt-6 gap-2">
            <label>Username:</label>
            <Input
              type="text"
              placeholder="Nome de usuário"
              className="border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div className=" w-full flex flex-col mt-6 gap-2">
            <label>Nome:</label>
            <Input
              type="text"
              placeholder="Digite seu nome"
              className="border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  nome: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className=" w-full flex flex-col mt-6 gap-2">
          <label>Email:</label>
          <Input
            type="email"
            placeholder="exemplo@exemplo.com"
            className="border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value,
              })
            }
            required
          />
        </div>

        <div className=" w-full flex flex-col mt-6 gap-2">
          <label>Senha:</label>
          <Input
            type="text"
            placeholder="*******"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                password: e.target.value,
              })
            }
            className="border-1 border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d]"
            value={newUser?.password}
          />
        </div>

        <div className=" w-full flex flex-col mt-6 gap-2">
          <label>Perfil de usuário:</label>
          <div className="relative  ">
            <select
              name="perfil"
              id="perfil"
              className="w-full border-1 appearance-none  border-[#27272760] rounded-md  p-3 focus:outline-[#30a66d] "
              value={newUser.profile}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  profile: e.target.value as "admin" | "user",
                })
              }
            >
              {profiles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            <Icon
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
              path={mdiMenuDown}
              size={1}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer"
          onClick={() => cadastrarUsuario(newUser)}
        >
          Confirmar cadastro
        </button>
      </div>
    </div>
  );
}
