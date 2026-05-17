import { unfavoriteIcon, favoriteIcon, trashIcon } from "../../../assets";
import { parseMoneyToFloat } from "../../../utils/formatters";

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
      className={`w-full ${background} scale-95 hover:scale-98 active:scale-95 transition-all duration-500 ease-out shadow-sm rounded-3xl px-8 py-8 items-center cursor-pointer hover:brightness-85`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="hover:scale-110 transition-transform active:scale-90 cursor-pointer shrink-0"
          >
            <img
              src={list.isFavorite ? favoriteIcon : unfavoriteIcon}
              alt={
                list.isFavorite ? "Remover dos favoritos" : "Favoritar lista"
              }
              className={"h-10 w-10"}
              draggable={false}
            />
          </button>

          <h1
            title={list.name}
            className={`${
              (list.name?.length || 0) <= 20
                ? "text-3xl"
                : (list.name?.length || 0) <= 40
                  ? "text-2xl"
                  : "text-xl"
            } font-semibold text-[#3A2414] leading-tight truncate`}
          >
            {list.name}
          </h1>
        </div>

        <div
          className="flex items-center gap-6 pl-6 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {parseMoneyToFloat(list.total_spent) > 0 && (
            <span className="font-bold text-xl text-[#e67700] min-w-30 text-right whitespace-nowrap">
              TOTAL: {list.total_spent}
            </span>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="bg-orange p-3 rounded-2xl hover:bg-red-600 transition-all shadow-md cursor-pointer shrink-0"
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

      <div className="flex w-full items-center justify-center gap-3 mt-6">
        <div className="w-full h-3 bg-[#ffdcb6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#b75307] transition-all duration-500 ease-out"
            style={{ width: list.percentage_now || "0%" }}
          ></div>
        </div>
        <span className="text-black font-bold text-lg whitespace-nowrap shrink-0">
          {list.percentage_now}
        </span>
      </div>

      <p className="text-left text-xl font-medium mt-2 text-[#3A2414]/80 truncate">
        Criado por {list.author}
      </p>
    </div>
  );
}

export default ListContainer;
