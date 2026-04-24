import { unfavoriteIcon, favoriteIcon } from "../../assets";

function ListContainer() {
  return (
    <div className={`w-full h-[23%] bg-orange-dark rounded-3xl px-8 py-5`}>
      <div className="w-full flex justify-center">
        <h1 className="text-5xl font-medium text-[#333131]">Nome da lista</h1>
        <div className="w-[50%] flex items-center font-bold text-2xl text-white px-4 justify-evenly">
          <img src={favoriteIcon} alt="Icone de favorito" draggable={false} />
          <h1>TOTAL GASTO: R$400,00</h1>
        </div>
      </div>
    </div>
  );
}

export default ListContainer;
