import React from "react";
import { pencilTerracotaIcon } from "../../../assets";

function ItemInfo({ item, title, desc, onEditItem, onEditClick }) {
  const handleItemClick = () => {
    if (onEditItem) onEditItem(item);
  };

  const handlePencilClick = (e) => {
    e.stopPropagation();
    if (onEditClick) onEditClick(item);
  };

  return (
    <div
      onClick={handleItemClick}
      className="w-full flex flex-col gap-1 rounded-2xl bg-[#FEF6E4] p-3 xl:px-5 xl:py-4 duration-300 cursor-pointer 
               scale-[0.99] hover:scale-100 hover:shadow-md border border-white/10 transition-all origin-center"
    >
      <div className="flex justify-between items-start w-full gap-2">
        <h3 className="text-[#E0651A] text-base md:text-lg xl:text-xl font-bold line-clamp-1">
          {title}
        </h3>

        <img
          onClick={handlePencilClick}
          src={pencilTerracotaIcon}
          alt="Ícone de Lápis para Edição"
          loading="lazy"
          className="w-5 h-5 md:w-6 md:h-6 shrink-0 duration-300 ease-out transition-all active:scale-90 active:brightness-90 cursor-pointer"
          draggable={false}
        />
      </div>

      <p className="w-full text-[#5D2A11] font-medium text-[11px] md:text-xs line-clamp-3 opacity-80 mt-0.5">
        {desc}
      </p>
    </div>
  );
}

export default React.memo(ItemInfo);
