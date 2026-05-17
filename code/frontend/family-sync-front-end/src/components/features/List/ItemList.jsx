import { checkIcon } from "../../../assets";
import { formatToBRL } from "../../../utils/formatters";

function ItemList({
  name,
  price = 0,
  units = 0,
  isSelected,
  onToggle,
  onDelete,
}) {
  const formattedPrice = formatToBRL(price);
  const formattedResult = formatToBRL(units * price);

  return (
    <div className="relative w-full bg-[#FFF8E7] flex flex-col px-6 py-4 rounded-[25px] shadow-sm min-h-25 scale-95 hover:scale-98 active:scale-95 transition-all duration-500 ease-out hover:brightness-95 group">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-6 text-brown-dark/40 hover:text-red-light font-bold text-xl  px-2 rounded-full transition-colors cursor-pointer hidden group-hover:block hover:bg-black/20"
        title="Excluir item"
      >
        ✕
      </button>

      {/* Título do Item */}
      <p className="text-brown-dark text-[22px] font-semibold text-center w-full leading-tight truncate mb-3 pr-4">
        {name}
      </p>

      {/* Grid de Informações e Ações */}
      <div className="grid grid-cols-[1fr_100px_24px] gap-4 items-center w-full px-2">
        <div className="flex justify-start">
          <div className="bg-orange-dark px-3 py-1 rounded-full font-black text-white text-[18px] flex items-center whitespace-nowrap">
            {units} x {formattedPrice}
          </div>
        </div>

        <div className="text-right">
          <span className="font-bold text-[18px] text-orange-dark whitespace-nowrap">
            {formattedResult}
          </span>
        </div>

        {/* Checkbox customizado */}
        <div
          onClick={onToggle}
          className={`
            h-7 w-7 rounded-[10px] cursor-pointer transition-colors duration-200 flex items-center justify-center
            ${isSelected ? "bg-orange-dark" : "bg-amber-900"}
          `}
        >
          {isSelected && (
            <img src={checkIcon} alt="Checked Icon" className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemList;
