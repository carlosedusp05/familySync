import { useState } from "react";
import DefaultButton from "../../ui/DefaultButton";
import { formatMoneyMask, parseMoneyToFloat } from "../../../utils/formatters"; // Importando as novas funções

function ItemCreationForm({ onAddItem, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // Armazenará a string mascarada (ex: "R$ 10,50")
  const [units, setUnits] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, digite o nome do item.");

    // Converte a máscara "R$ 10,50" para o número float 10.5 antes de enviar para o estado global
    const numericPrice = parseMoneyToFloat(price);

    onAddItem({ name, price: numericPrice, units: Number(units) });
    handleReset();
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    // Aplica a máscara de dinheiro em tempo real
    setPrice(formatMoneyMask(rawValue));
  };

  const handleReset = () => {
    setName("");
    setPrice("");
    setUnits("1");
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-55 bg-[#FFF8E7] flex flex-col px-6 py-8 rounded-[25px] shadow-md scale-95 transition-all duration-300 animate-fadeIn"
    >
      <input
        type="text"
        placeholder="Nome do produto..."
        value={name}
        maxLength={100}
        onChange={(e) => setName(e.target.value)}
        className="text-brown-dark text-[25px] font-semibold text-center w-full bg-transparent border-b border-brown-dark/20 focus:border-orange-dark outline-none mb-4 pb-1 placeholder:text-brown-dark/40"
        autoFocus
      />

      <div className="grid grid-cols-2 gap-3 items-center w-full px-2 mb-4">
        {/* Quantidade */}
        <div className="flex items-center gap-1 bg-orange-dark/10 px-3 py-1.5 rounded-full">
          <span className="text-orange-dark font-bold text-xl">Qtd:</span>
          <input
            type="number"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full bg-transparent text-orange-dark font-black text-[20px] outline-none text-center"
          />
        </div>

        {/* Preço com máscara em tempo real */}
        <div className="flex items-center gap-1 bg-orange-dark/10 px-3 py-1.5 rounded-full">
          <input
            type="text" /* Mudado para text para suportar os caracteres da máscara */
            inputMode="numeric" /* Melhora o teclado numérico em dispositivos móveis */
            placeholder="R$ 0,00"
            value={price}
            onChange={handlePriceChange}
            className="w-full bg-transparent text-orange-dark font-black text-[20px] outline-none text-center placeholder:text-orange-dark/40"
          />
        </div>
      </div>

      <div className="flex gap-15 justify-end w-full px-2 text-sm font-semibold">
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
