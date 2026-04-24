import { useState } from "react";
import { unfavoriteIcon, favoriteIcon, trashIcon } from "../../assets";

function ListContainer({
  name,
  total_spent,
  percentage_now,
  author,
  isFavorite = false,
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const percentage = percentage_now ? percentage_now : 0;

  return (
    <div className={`w-full bg-orange-dark rounded-3xl px-8 py-5 items-center`}>
      <div className="relative w-full flex justify-center">
        <div className="w-[80%] flex flex-wrap py-3 mx-20">
          <h1 className="text-4xl font-medium text-[#333131] flex-1 leading-tight">
            {name}
          </h1>
          <div className="absolute left-[50%]">
            <button
              onClick={() => setFavorite(!favorite)}
              className="focus:outline-none hover:scale-110 transition-transform active:scale-90"
            >
              <img
                src={favorite ? favoriteIcon : unfavoriteIcon}
                alt="Icone de favorito"
                className="w-14 h-14 cursor-pointer"
                draggable={false}
              />
            </button>
          </div>

          <h1 className="absolute left-[56%] top-[30%] flex items-center font-bold text-2xl text-white">
            TOTAL GASTO: {total_spent}
          </h1>
        </div>

        <button className="bg-red-light p-4 rounded-3xl duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 shadow-lg">
          <img
            src={trashIcon}
            alt="Icone de lixo"
            className="w-8 h-8"
            draggable={false}
          />
        </button>
      </div>
      <div className="flex w-full items-center justify-center gap-3 mt-6">
        <div className="w-full h-6 bg-default rounded-3xl overflow-hidden">
          <div
            className="h-full w-[80%] bg-brown-dark"
            style={{ width: percentage }}
          ></div>
        </div>
        <h1 className="text-black font-extrabold text-3xl">{percentage_now}</h1>
      </div>
      <h1 className="text-2xl text-left text-white font-light px-10">
        Criado por {author}
      </h1>
    </div>
  );
}

export default ListContainer;
