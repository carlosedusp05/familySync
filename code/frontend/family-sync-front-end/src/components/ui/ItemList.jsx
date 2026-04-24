import { checkIcon } from "../../assets";

function ItemList({ name, price = 0, units = 0, isSelected, onToggle }) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const formattedResult = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(units * price);

  return (
    <div className="relative w-full bg-[#FFF8E7] flex flex-col items-center justify-center px-4 py-3 rounded-[25px] shadow-sm min-h-25">
      <h1 className="text-brown-dark text-[22px] font-semibold text-center flex-1 leading-tight truncate">
        {name}
      </h1>
      <div className="flex items-center justify-between gap-12 w-full px-20">
        <div className="bg-orange-dark px-3 py-1 rounded-full font-black text-white text-[18px] flex items-center shrink-0 whitespace-nowrap">
          {units} x {formattedPrice}
        </div>
        <h1 className="font-bold text-[18px] text-orange-dark shrink-0 whitespace-nowrap">
          {formattedResult}
        </h1>
        <div
          onClick={onToggle}
          className={`
          h-6 w-6 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center shrink-0
          ${isSelected ? "bg-orange-dark" : "bg-amber-900"}`}
        >
          {isSelected && <img src={checkIcon} alt="Checked Icon" />}
        </div>
      </div>
    </div>
  );
}

export default ItemList;
