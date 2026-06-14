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
      className={`w-full ${background} h-auto min-h-[120px] lg:min-h-[200px] flex flex-col justify-center scale-95 hover:scale-98 active:scale-95 transition-all duration-500 ease-out shadow-sm rounded-[20px] lg:rounded-3xl px-4  lg:px-8 lg:py-6 cursor-pointer hover:brightness-85`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0 pr-2 lg:pr-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="hover:scale-110 transition-transform active:scale-90 cursor-pointer shrink-0"
          >
            <img
              src={list.favorita ? favoriteIcon : unfavoriteIcon}
              alt={list.favorita ? "Remover dos favoritos" : "Favoritar lista"}
              className={"h-6 w-6 lg:h-10 lg:w-10"}
              draggable={false}
            />
          </button>

          <h1
            title={list.nome}
            className={`${
              (list.nome?.length || 0) <= 20
                ? "text-[16px] lg:text-3xl"
                : (list.nome?.length || 0) <= 40
                  ? "text-xl lg:text-2xl"
                  : "text-base lg:text-xl"
            } font-semibold text-[#3A2414] leading-tight truncate`}
          >
            {list.nome}
          </h1>
        </div>

        <div
          className="flex items-center gap-3 lg:gap-6 pl-2 lg:pl-6 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {list.items?.length > 0 && (
            <span className="font-bold text-[12px] lg:text-xl text-[#e67700] min-w-20 lg:min-w-30 text-right whitespace-nowrap">
              TOTAL:{" "}
              {list.items
                .reduce(
                  (total, item) =>
                    total +
                    (Number(item.valor_unitario) || 0) *
                      (Number(item.quantidade) || 1),
                  0,
                )
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </span>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="bg-orange p-2 lg:p-3 rounded-xl lg:rounded-2xl hover:bg-red-600 transition-all shadow-md cursor-pointer shrink-0"
          >
            <img
              src={trashIcon}
              alt="Excluir lista"
              className="w-4 h-4 lg:w-6 lg:h-6"
              draggable={false}
            />
          </button>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-3 mt-2 lg:mt-6">
        <div className="w-full h-2 lg:h-3 bg-[#ffdcb6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#b75307] transition-all duration-500 ease-out"
            style={{ width: list.percentage_now || "0%" }}
          ></div>
        </div>
        <span className="text-black font-bold text-[12px] lg:text-lg whitespace-nowrap shrink-0">
          {list.percentage_now}
        </span>
      </div>

      <p className="text-left text-[12px] lg:text-xl font-medium mt-1 lg:mt-2 text-[#3A2414]/80 truncate">
        Criado por {list.author}
      </p>
    </div>
  );
}

export default ListContainer;
