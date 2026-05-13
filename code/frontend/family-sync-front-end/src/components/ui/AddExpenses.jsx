import DefaultButton from "./DefaultButton";
import { useState } from "react";

function AddExpenses({ is_edit_expenses, onClose, onSave }) {
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [emoji, setEmoji] = useState("💰");

  const handleConfirm = () => {
    if (!valor || !categoria) {
      return alert("Preencha o valor e o nome da categoria!");
    }

    onSave(categoria, Number(valor), emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[500px] bg-[#FFF9F2] rounded-[32px] flex flex-col items-center py-10 px-8 shadow-2xl border border-orange-200">
        <h1 className="text-[28px] font-extrabold text-[#5B3E31] mb-8">
          {is_edit_expenses ? "Editar Gasto" : "Novo Gasto"}
        </h1>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative group">
            <input
              type="text"
              maxLength="2"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-20 h-20 text-4xl flex items-center justify-center bg-white border-[3px] border-[#E77838] rounded-full text-center outline-none shadow-sm transition-transform focus:scale-105"
            />
          </div>

          <div className="flex justify-center items-end gap-2 w-full mt-6">
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-1/2 outline-none text-[#E77838] text-[40px] text-center font-bold border-b-[3px] border-[#E77838] bg-transparent"
              placeholder="0,00"
            />
            <span className="text-[#E77838] text-xl font-bold mb-2">BRL</span>
          </div>

          <input
            type="text"
            placeholder="Nome da categoria (ex: Netflix, Mercado...)"
            className="w-full mt-8 rounded-2xl outline-none border border-orange-200 text-base text-gray-700 bg-white p-4 focus:border-[#E77838] focus:ring-1 focus:ring-[#E77838] transition-all"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div className="flex gap-6 mt-12 w-full justify-center">
          <DefaultButton text="Cancelar" theme={false} onClick={onClose} />
          <DefaultButton text="Confirmar" onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

export default AddExpenses;
