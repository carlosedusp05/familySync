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
  const hasPrice = price > 0;
  const formattedPrice = formatToBRL(price);
  const formattedResult = formatToBRL(units * price);

  const nameSizeClass = name.length > 20 ? "text-xl" : "text-3xl";

  return (
    <div className="relative w-full bg-[#FFF8E7] flex items-center justify-between px-6 py-5 rounded-[25px] shadow-sm min-h-35 scale-95 hover:scale-98 active:scale-95 transition-all duration-300 ease-out hover:brightness-95 group">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-6 text-brown-dark/40 hover:text-red-light font-bold text-xl px-2 rounded-full transition-colors cursor-pointer hidden group-hover:block hover:bg-black/10 z-10"
        title="Excluir item"
      >
        ✕
      </button>

      <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
        {hasPrice ? (
          <div className="flex flex-col gap-3">
            <p
              className={`text-brown-dark ${nameSizeClass} font-semibold leading-tight truncate`}
              title={name}
            >
              {name}
            </p>

            <div className="flex flex-col gap-1.5 items-start">
              <div
                className="bg-orange-dark/15 text-orange-dark px-3 py-0.5 rounded-full font-bold text-[14px] max-w-full truncate"
                title={`${units} x ${formattedPrice}`}
              >
                {units} x {formattedPrice}
              </div>

              <span
                className="font-black text-[20px] text-orange-dark max-w-full truncate pl-1"
                title={formattedResult}
              >
                {formattedResult}
              </span>
            </div>
          </div>
        ) : (
          <p
            className={`text-brown-dark ${nameSizeClass} font-semibold leading-tight truncate`}
            title={name}
          >
            {name}
          </p>
        )}
      </div>
      <div
        onClick={onToggle}
        className={`h-8 w-8 rounded-[11px] cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95
          ${isSelected ? "bg-orange-dark" : "bg-amber-950"}`}
      >
        {isSelected && (
          <img
            src={checkIcon}
            alt="Checked Icon"
            className="h-5 w-5 animate-scaleIn"
          />
        )}
      </div>
    </div>
  );
}

export default ItemList;
