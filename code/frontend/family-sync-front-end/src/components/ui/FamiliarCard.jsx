function FamiliarCard({ name, degree_of_relatives }) {
  return (
    <div className="flex w-full h-auto bg-white p-6 rounded-3xl shadow-sm gap-5 items-center">
      <div className="text-brown-dark flex-1 flex flex-col items-center justify-center gap-1">
        <div className="bg-terracota rounded-full h-24 w-24"></div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex text-[16px] gap-1 whitespace-nowrap">
          <span className="font-bold">Grau de parentesco:</span>
          <span>{degree_of_relatives}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 pr-8">
        <h1 className="font-bold text-terracota text-left text-3xl mb-3 whitespace-nowrap">
          Pode Editar
        </h1>

        <div className="flex justify-between items-center w-full text-brown-dark text-[16px] font-normal">
          <span>Calendário</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-terracota cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center w-full text-brown-dark text-[16px] font-normal">
          <span>Lista</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-terracota cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center w-full text-brown-dark text-[16px] font-normal">
          <span>Despesas</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-terracota cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center w-full text-brown-dark text-[16px] font-normal">
          <span>Informações</span>
          <input
            type="checkbox"
            className="w-5 h-5 accent-terracota cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default FamiliarCard;
