import { useState } from "react";
import { unfavoriteIcon, favoriteIcon, trashIcon } from "../../assets";

function ListContainer({
  name,
  total_spent,
  percentage_now,
  author,
  isFavorite = false,
  background,
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const percentage = percentage_now ? percentage_now : 0;

  return (
    <div
      className={`w-full ${background} shadow-sm rounded-3xl px-8 py-8 items-center`}
    >
      <div className="w-full flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold text-[#3A2414] leading-tight">
            {name}
          </h1>
        </div>

        <div className="flex items-center gap-10 pl-6">
          <button
            onClick={() => setFavorite(!favorite)}
            className="hover:scale-110 transition-transform active:scale-90"
          >
            <img
              src={favorite ? favoriteIcon : unfavoriteIcon}
              alt="Ícone favorito"
              className="h-10"
              draggable={false}
            />
          </button>

          <h1 className="font-bold text-xl text-[#e67700] w-50 flex items-center justify-center">
            TOTAL: {total_spent}
          </h1>

          <button className="bg-orange p-3 rounded-2xl hover:bg-red transition-all shadow-md cursor-pointer">
            <img
              src={trashIcon}
              alt="Ícone de lixo"
              className="w-6 h-6"
              draggable={false}
            />
          </button>
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-3 mt-6">
        <div className="w-full h-3 bg-[#ffdcb6] rounded-full overflow-hidden">
          <div
            className="h-full w-[80%] bg-[#b75307]"
            style={{ width: percentage }}
          ></div>
        </div>
        <h1 className="text-black font-bold text-lg">{percentage_now}</h1>
      </div>
      <h1 className=" text-lef text-sm font-light px-10">
        Criado por {author}
      </h1>
    </div>
  );
}

export default ListContainer;
