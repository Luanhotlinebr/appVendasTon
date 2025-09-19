export function Home() {
  return (
    <div className="flex flex-col items-center h-screen bg-[#f2f4f7]">
      <div className="w-full max-w-3/4 flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white mt-3">
        <label>Máquinas vendidas</label>
      </div>
      <div className="w-full max-w-3/4 flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white mt-3">
        <label>Ticket Médio</label>
      </div>
      <div className="w-full max-w-3/4 flex flex-col justify-center items-center p-6 rounded-md shadow-md bg-white mt-3">
        Total de comissão
      </div>
    </div>
  );
}
