function FamiliarCard({ name, degree_of_relatives }) {
  return (
    <div className="flex w-full max-w-xl bg-white p-5.5 rounded-xl shadow-sm gap-3 items-center overflow-hidden shrink-0 border border-gray-100">
      <div className="text-brown-dark flex-1 min-w-0 flex flex-col items-center justify-center gap-1 border-r border-gray-100 pr-2">
        <div className="bg-terracota rounded-full h-20 w-20 shrink-0"></div>
        <h1
          className="text-xl font-bold truncate w-full text-center leading-tight"
          title={name}
        >
          {name}
        </h1>
        <span
          className="text-[16px] text-gray-500 truncate w-full text-center"
          title={degree_of_relatives}
        >
          {degree_of_relatives}
        </span>
      </div>

      <div className="flex-[1.2] min-w-0 flex flex-col justify-center gap-0.5">
        <h2 className="font-bold text-terracota text-left text-2xl mb-1 tracking-wider">
          Pode Editar
        </h2>

        {[
          { label: "Calendário", id: "cal" },
          { label: "Lista", id: "list" },
          { label: "Despesas", id: "exp" },
          { label: "Informações", id: "info" },
        ].map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center w-full text-brown-dark text-xl font-medium py-0.5"
          >
            <span>{item.label}</span>
            <input
              type="checkbox"
              className="w-5 h-5 accent-terracota cursor-pointer shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamiliarCard;
