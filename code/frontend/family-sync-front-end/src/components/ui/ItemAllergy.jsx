import React from "react";
import { pencilTerracotaIcon } from "../../assets";

function ItemAllergy({ item, title, desc, creator, onEditItem, onEditClick }) {
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
      className="w-[98%] flex flex-col gap-2 rounded-2xl bg-white-yellow relative p-8 pt-5 py-2 duration-300 cursor-pointer 
             hover:scale-[1.01] hover:shadow-xl border border-white/5 will-change-transform"
    >
      <div className="px-10 flex absolute top-5 left-0 py-1 rounded-tl-2xl">
        <h3 className="text-orange flex text-3xl font-medium">{title}</h3>
      </div>

      <div className="flex justify-end gap-5 items-center">
        <img
          onClick={handlePencilClick}
          src={pencilTerracotaIcon}
          alt="Ícone de Lápis para Edição"
          // 5. loading="lazy" ajuda se a lista for gigantesca
          loading="lazy"
          className="duration-300 ease-out transition-all active:scale-90 active:brightness-90 cursor-pointer"
          draggable={false}
        />
      </div>

      <p className="w-[90%] text-terracota font-bold text-[18px] flex-wrap">
        {desc}
      </p>

      <span className="text-red text-[16px] font-bold">{creator}</span>
    </div>
  );
}

export default React.memo(ItemAllergy);
