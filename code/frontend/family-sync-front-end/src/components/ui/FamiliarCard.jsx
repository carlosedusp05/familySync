function FamiliarCard() {
  return (
    <div className="flex w-[80%] h-[20%] bg-white">
      <div className="text-brown-dark flex-1 flex items-center">
        <div className="bg-terracota rounded-full h-20 w-20"></div>
        <div className="flex text-2xl">
          <h1 className="font-bold">Grau de parentesco:</h1>
          <h1>Filho</h1>
        </div>
      </div>
      <div className="flex-1 flex-col">
        <h1 className="font-bold text-terracota text-3xl">Pode Editar</h1>
        <div className="flex text-brown-dark text-2xl">
          <span>Calendário</span>
          <input type="checkbox" className="" />
        </div>
        <div className="flex text-brown-dark text-2xl">
          <span>Lista</span>
          <input type="checkbox" />
        </div>
        <div className="flex text-brown-dark text-2xl">
          <span>Despesas</span>
          <input type="checkbox" />
        </div>
        <div className="flex text-brown-dark text-2xl">
          <span>Informações Familiares</span>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  );
}

export default FamiliarCard;
