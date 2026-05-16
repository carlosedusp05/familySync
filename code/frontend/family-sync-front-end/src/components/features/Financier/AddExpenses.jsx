import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultButton from "../../ui/DefaultButton.jsx";
import {
  formatToBRL,
  validateExpenseValue,
} from "../../../utils/formatters.js";

const FINANCE_EMOJIS = [
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

function AddExpenses({ is_edit_expenses, onClose, onSave, initialData }) {
  const [valor, setValor] = useState(initialData ? initialData.valor : 0);
  const [categoria, setCategoria] = useState(
    initialData ? initialData.label : "",
  );
  const [emojiSelecionado, setEmojiSelecionado] = useState(
    initialData ? initialData.emoji : "🛍️",
  );
  const [errors, setErrors] = useState({});

  const validate = useCallback((campo, val) => {
    let msg = "";
    if (campo === "valor" && !validateExpenseValue(val))
      msg = "Insira um valor maior que zero";
    if (campo === "categoria" && !val.trim())
      msg = "O nome da categoria é obrigatório";

    setErrors((prev) => ({ ...prev, [campo]: msg }));
    return !msg;
  }, []);

  const handleConfirm = useCallback(() => {
    const isValorValid = validate("valor", valor);
    const isCatValid = validate("categoria", categoria);

    if (isValorValid && isCatValid) {
      onSave(categoria, valor, emojiSelecionado, initialData?.id);
    }
  }, [validate, valor, categoria, emojiSelecionado, onSave, initialData]);

  const handleValorChange = useCallback(
    (e) => {
      const apenasDigitos = e.target.value.replace(/\D/g, "");
      const valorNumerico = apenasDigitos ? Number(apenasDigitos) / 100 : 0;
      setValor(valorNumerico);
      if (errors.valor) setErrors((prev) => ({ ...prev, valor: "" }));
    },
    [errors.valor],
  );

  const handleCategoriaChange = useCallback(
    (e) => {
      setCategoria(e.target.value);
      if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: "" }));
    },
    [errors.categoria],
  );

  const displayValor = useMemo(
    () => (valor > 0 ? formatToBRL(valor).replace("R$", "").trim() : ""),
    [valor],
  );
  const emojiGrid = useMemo(
    () => (
      <div className="grid grid-cols-4 gap-4 max-h-52 overflow-y-auto pr-2 custom-scrollbar py-2">
        {FINANCE_EMOJIS.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEmojiSelecionado(item.icon)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-colors border-[3px] shadow-sm
            ${emojiSelecionado === item.icon ? "bg-orange border-orange" : "bg-white border-orange/30 hover:border-orange"}`}
          >
            <span
              className={
                emojiSelecionado === item.icon
                  ? "brightness-110"
                  : "grayscale-[0.5]"
              }
            >
              {item.icon}
            </span>
          </motion.button>
        ))}
      </div>
    ),
    [emojiSelecionado],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 will-change-opacity"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] bg-white rounded-[40px] flex flex-col items-center py-8 px-10 shadow-2xl border border-orange-100 will-change-transform"
      >
        <h1 className="text-[26px] font-black text-brown-dark mb-8">
          {is_edit_expenses ? "Editar gastos" : "Adicionar gastos"}
        </h1>

        <div className="flex flex-col items-center w-full mb-8">
          <div
            className={`flex items-end gap-3 border-b-2 transition-colors px-6 pb-2 ${errors.valor ? "border-red-500" : "border-orange"}`}
          >
            <input
              type="text"
              inputMode="decimal"
              value={displayValor}
              onChange={handleValorChange}
              onBlur={() => validate("valor", valor)}
              className="w-48 outline-none text-orange text-[42px] font-black bg-transparent text-center placeholder:text-orange/20"
              placeholder="0,00"
            />
            <span className="text-orange text-xl font-bold mb-3">BRL</span>
          </div>
          <AnimatePresence>
            {errors.valor && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-xs font-bold mt-2 uppercase overflow-hidden"
              >
                {errors.valor}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full bg-[#FFF4D1] rounded-[35px] p-6 flex flex-col gap-6 shadow-inner">
          <div className="w-full">
            <div className="flex flex-col items-center w-full">
              <input
                type="text"
                placeholder="Nome da categoria"
                className={`w-full h-14 rounded-full outline-none border-2 px-6 text-lg font-bold bg-white transition-colors ${errors.categoria ? "border-red-400" : "border-transparent focus:border-orange"}`}
                value={categoria}
                onChange={handleCategoriaChange}
                onBlur={() => validate("categoria", categoria)}
              />
              <AnimatePresence>
                {errors.categoria && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-500 text-xs font-bold mt-2 uppercase overflow-hidden"
                  >
                    {errors.categoria}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          {emojiGrid}
        </div>

        <div className="flex gap-6 mt-10 w-full justify-center">
          <DefaultButton onClick={onClose} text="Cancelar" theme={false} />
          <DefaultButton
            onClick={handleConfirm}
            text={is_edit_expenses ? "Salvar" : "Adicionar"}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddExpenses;
