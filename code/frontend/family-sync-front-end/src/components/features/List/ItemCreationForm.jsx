import { useState } from "react";
import DefaultButton from "../../ui/DefaultButton";
import { formatMoneyMask, parseMoneyToFloat } from "../../../utils/formatters";

function ItemCreationForm({ onAddItem, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("1");
  const [isPurchase, setIsPurchase] = useState(true); // Controla ambos os campos

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, digite o nome do item.");

    // Se estiver desativado, envia 0 para preço e quantidade
    const numericPrice = isPurchase ? parseMoneyToFloat(price) : 0;
    const numericUnits = isPurchase ? Number(units) : 0;

    onAddItem({ name, price: numericPrice, units: numericUnits });
    handleReset();
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    setPrice(formatMoneyMask(rawValue));
  };

  const handleReset = () => {
    setName("");
    setPrice("");
    setUnits("1");
    setIsPurchase(true);
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-65 bg-[#FFF8E7] flex flex-col px-6 py-8 rounded-[25px] shadow-md scale-95 transition-all duration-300 animate-fadeIn"
    >
      <input
        type="text"
        placeholder="Nome do produto..."
        value={name}
        maxLength={50}
        onChange={(e) => setName(e.target.value)}
        className="text-brown-dark text-[25px] font-semibold text-center w-full bg-transparent border-b border-brown-dark/20 focus:border-orange-dark outline-none mb-5 pb-1 placeholder:text-brown-dark/40"
        autoFocus
      />

      <div
        className="flex items-center gap-2 px-2 mb-2 cursor-pointer w-fit group"
        onClick={() => setIsPurchase(!isPurchase)}
      >
        <div className="w-6 h-6 rounded-full border-2 border-orange-dark flex items-center justify-center transition-transform group-active:scale-95 shrink-0">
          {isPurchase && (
            <div className="w-3 h-3 bg-orange-dark rounded-full animate-fadeIn" />
          )}
        </div>
        <span className="text-orange-dark font-semibold text-[15px] select-none">
          Incluir quantidade e valor
        </span>
      </div>
      <div
        className={`grid grid-cols-2 gap-3 items-center w-full px-2 mb-4 transition-all duration-300 ${
          !isPurchase ? "opacity-40 grayscale-20 pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center gap-1 bg-orange-dark/10 px-3 py-1.5 rounded-full">
          <span className="text-orange-dark font-bold text-xl">Qtd:</span>
          <input
            type="number"
            min="1"
            value={units}
            max="999"
            disabled={!isPurchase}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 3) {
                setUnits(value);
              }
            }}
            className="w-full bg-transparent text-orange-dark font-black text-[20px] outline-none text-center disabled:bg-transparent"
          />
        </div>

        <div className="flex items-center gap-1 bg-orange-dark/10 px-3 py-1.5 rounded-full">
          <input
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={price}
            maxLength={16}
            disabled={!isPurchase}
            onChange={handlePriceChange}
            className="w-full bg-transparent text-orange-dark font-black text-[20px] outline-none text-center placeholder:text-orange-dark/40 disabled:bg-transparent"
          />
        </div>
      </div>

      <div className="flex gap-15 justify-end w-full px-2 mt-1 text-sm font-semibold">
        <DefaultButton
          another_padding={"px-5 py-2"}
          type="button"
          text="Cancelar"
          onClick={handleReset}
          theme={false}
        />
        <DefaultButton
          another_padding={"px-5 py-2"}
          type="submit"
          text="Adicionar"
        />
      </div>
    </form>
  );
}

export default ItemCreationForm;
