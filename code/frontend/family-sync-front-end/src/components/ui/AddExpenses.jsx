import { useState } from "react";
import { motion } from "framer-motion";
import DefaultButton from "./DefaultButton";
import { formatToBRL, validateExpenseValue } from "../../utils/formatters.js";

function AddExpenses({ is_edit_expenses, onClose, onSave }) {
  const [valor, setValor] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [emojiSelecionado, setEmojiSelecionado] = useState("🛍️");
  const [errors, setErrors] = useState({ valor: "", categoria: "" });

  const financeEmojis = [
    { icon: "🛍️", label: "Compras" },
    { icon: "💡", label: "Luz" },
    { icon: "💧", label: "Água" },
    { icon: "🏠", label: "Casa" },
    { icon: "❤️", label: "Saúde" },
    { icon: "📖", label: "Educação" },
    { icon: "🍴", label: "Alimentação" },
    { icon: "👥", label: "Família" },
    { icon: "🚗", label: "Transporte" },
    { icon: "🎮", label: "Lazer" },
    { icon: "📱", label: "Assinaturas" },
    { icon: "💰", label: "Outros" },
  ];

  const validateFieldOnBlur = (campoId, valorAtual) => {
    let erroMensagem = "";
    if (campoId === "valor") {
      if (!validateExpenseValue(valorAtual))
        erroMensagem = "Insira um valor maior que zero";
    }
    if (campoId === "categoria") {
      if (!valorAtual.trim())
        erroMensagem = "O nome da categoria é obrigatório";
    }
    setErrors((prev) => ({ ...prev, [campoId]: erroMensagem }));
  };

  const handleConfirm = () => {
    let hasError = false;
    if (!validateExpenseValue(valor)) {
      setErrors((prev) => ({
        ...prev,
        valor: "Insira um valor maior que zero",
      }));
      hasError = true;
    }
    if (!categoria.trim()) {
      setErrors((prev) => ({
        ...prev,
        categoria: "O nome da categoria é obrigatório",
      }));
      hasError = true;
    }
    if (!hasError) onSave(categoria, valor, emojiSelecionado);
  };

  const handleValorChange = (e) => {
    const apenasDigitos = e.target.value.replace(/\D/g, "");
    const valorNumerico = Number(apenasDigitos) / 100;
    setValor(valorNumerico);
    if (errors.valor) setErrors({ ...errors, valor: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-150 bg-white rounded-[40px] flex flex-col items-center py-8 px-10 shadow-2xl relative border border-orange-100 transform-gpu"
      >
        <h1 className="text-[26px] font-black text-[#5B3E31] mb-8 antialiased">
          {is_edit_expenses ? "Editar gastos" : "Adicionar gastos"}
        </h1>

        <div className="flex flex-col items-center w-full mb-10">
          <div
            className={`flex items-end gap-3 border-b-2 transition-colors px-6 pb-2 ${errors.valor ? "border-red-500" : "border-[#E77838]"}`}
          >
            <input
              type="text"
              value={
                valor > 0 ? formatToBRL(valor).replace("R$", "").trim() : ""
              }
              onChange={handleValorChange}
              onBlur={() => validateFieldOnBlur("valor", valor)}
              maxLength={14}
              className="w-48 outline-none text-[#E77838] text-[42px] font-black bg-transparent text-center placeholder:opacity-30"
              placeholder="0,00"
            />
            <span className="text-[#E77838] text-xl font-bold mb-3">BRL</span>
          </div>
          {errors.valor && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-light text-xs font-semibold mt-2 uppercase tracking-tighter"
            >
              {errors.valor}
            </motion.p>
          )}
        </div>

        <div className="w-full bg-[#FFF4D1] rounded-[35px] p-8 flex flex-col gap-6 shadow-inner relative">
          <div className="w-full">
            <input
              type="text"
              placeholder="Nome"
              className={`w-full h-14 rounded-full outline-none border-2 px-6 text-lg font-medium text-gray-700 bg-white transition-all ${errors.categoria ? "border-red-400" : "border-transparent focus:border-[#E77838]"}`}
              value={categoria}
              maxLength={100}
              onChange={(e) => {
                setCategoria(e.target.value);
                if (errors.categoria) setErrors({ ...errors, categoria: "" });
              }}
              onBlur={() => validateFieldOnBlur("categoria", categoria)}
            />
            {errors.categoria && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-light text-[10px] font-semibold mt-2 ml-4 uppercase tracking-wider"
              >
                {errors.categoria}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-y-8 gap-x-4 max-h-50 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md py-2">
            {financeEmojis.map((item, index) => (
              <div key={index} className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEmojiSelecionado(item.icon)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 border-[3px] 
                    ${emojiSelecionado === item.icon ? "bg-orange border-orange shadow-lg" : "bg-white border-orange hover:bg-orange-50 shadow-sm"}`}
                >
                  <span
                    className={
                      emojiSelecionado === item.icon
                        ? "brightness-125 scale-110 transition-transform"
                        : ""
                    }
                  >
                    {item.icon}
                  </span>
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-20 mt-10 px-10 w-full justify-center">
          <DefaultButton onClick={onClose} text="Cancelar" theme={false} />
          <DefaultButton onClick={handleConfirm} text="Adicionar" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddExpenses;
