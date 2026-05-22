function FamiliarCard({ name, degree_of_relatives }) {
  return (
    <div className="flex w-full max-w-xl bg-white p-4 rounded-xl shadow-sm gap-3 items-center overflow-hidden shrink-0 border border-gray-100">
      <div className="text-brown-dark flex-1 min-w-0 flex flex-col items-center justify-center gap-1 border-r border-gray-100 pr-2">
        <div className="bg-terracota rounded-full h-16 w-16 shrink-0"></div>
        <h1
          className="text-[14px] font-bold truncate w-full text-center leading-tight"
          title={name}
        >
          {name}
        </h1>
        <span
          className="text-sm text-gray-500 truncate w-full text-center text-[10px]"
          title={degree_of_relatives}
        >
          {degree_of_relatives}
        </span>
      </div>

      <div className="flex-[1.5] min-w-0 flex flex-col justify-center gap-2 pl-2">
        <h2 className="font-bold text-terracota text-left text-lg tracking-wider">
          Pode Editar
        </h2>

        <div className="grid grid-cols-2 gap-y-2 gap-x-1 w-full">
          {[
            { label: "Calendário", id: "cal" },
            { label: "Lista", id: "list" },
            { label: "Despesas", id: "exp" },
            { label: "Informações", id: "info" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex justify-start items-center gap-2 w-full text-brown-dark text-xs font-medium"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-terracota cursor-pointer shrink-0"
              />
              <span className="truncate" title={item.label}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FamiliarCard;
