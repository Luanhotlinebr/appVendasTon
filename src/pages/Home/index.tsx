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
        <div className="w-full max-w-2xl flex flex-row justify-center items-center p-6 rounded-md shadow-md bg-white">
          <label className="w-full flex flex-col  gap-2">
            Total de vendas realizadas:
          </label>
          <label className="w-full flex flex-col  gap-2">
            Total de vendas realizadas:
          </label>
        </div>

        <div className="w-full max-w-2xl flex flex-row justify-center items-center p-6 rounded-md shadow-md bg-white mt-2"></div>
        <button
          className="bg-[#30a66d] w-full p-3 rounded-md text-white mt-6 cursor-pointer"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
