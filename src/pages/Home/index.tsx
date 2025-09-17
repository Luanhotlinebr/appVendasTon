import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout(navigate);
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white">
        <div className="flex flex-row gap-10">
          <div className="flex flex-col items-center border-1 rounded-2xl">
            <label>Minhas vendas:</label>
            <label>0</label>
          </div>
          <div className="flex flex-col items-center border-1 rounded-2xl">
            <label>Valor R$</label>
            <label>R$ 1200,00</label>
          </div>
          <button
            className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
