import { unfavoriteIcon, favoriteIcon, trashIcon } from "../../../assets";

function ListContainer({
  list,
  background,
  onClick,
  onToggleFavorite,
  onDelete,
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full ${background} scale-95 hover:scale-98 active:scale-95 transition-all duration-500 ease-out shadow-sm rounded-3xl px-8 py-8 items-center cursor-pointer hover:brightness-95`}
    >
      <div className="w-full flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold text-[#3A2414] leading-tight break-words">
            {list.name}
          </h1>
        </div>

        <div
          className="flex items-center gap-6 pl-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onToggleFavorite}
            className="hover:scale-110 transition-transform active:scale-90 cursor-pointer"
          >
            <img
              src={list.isFavorite ? favoriteIcon : unfavoriteIcon}
              alt={
                list.isFavorite ? "Remover dos favoritos" : "Favoritar lista"
              }
              className="h-10"
              draggable={false}
            />
          </button>

          <span className="font-bold text-xl text-[#e67700] min-w-[120px] text-center whitespace-nowrap">
            TOTAL: {list.total_spent}
          </span>

          <button
            type="button"
            onClick={onDelete}
            className="bg-orange p-3 rounded-2xl hover:bg-red-600 transition-all shadow-md cursor-pointer" // Ajustado hover:bg-red
          >
            <img
              src={trashIcon}
              alt="Excluir lista"
              className="w-6 h-6"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="flex w-full items-center justify-center gap-3 mt-6">
        <div className="w-full h-3 bg-[#ffdcb6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#b75307] transition-all duration-500 ease-out"
            style={{ width: list.percentage_now || "0%" }} // Fallback seguro caso seja undefined
          ></div>
        </div>
        <span className="text-black font-bold text-lg whitespace-nowrap">
          {list.percentage_now}
        </span>
      </div>

      <p className="text-left text-xl font-medium mt-2 text-[#3A2414]/80">
        Criado por {list.author}
      </p>
    </div>
  );
}

export default ListContainer;
