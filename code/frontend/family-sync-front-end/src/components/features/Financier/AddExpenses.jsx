import { useState, useMemo, useCallback, useEffect } from "react";
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
  const [valor, setValor] = useState(() =>
    parseFloat(initialData?.valor || initialData?.total || 0),
  );
  const [categoria, setCategoria] = useState(
    initialData?.tipo || initialData?.label || "",
  );
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [emojiSelecionado, setEmojiSelecionado] = useState(
    initialData?.icone || initialData?.emoji || "🛍️",
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValor(parseFloat(initialData.valor || initialData.total || 0));
      setCategoria(initialData.tipo || initialData.label || "");
      setDescricao(initialData.descricao || "");
      setEmojiSelecionado(initialData.icone || initialData.emoji || "🛍️");
    }
  }, [initialData]);

  const validate = useCallback((campo, val) => {
    let msg = "";
    if (campo === "valor" && !validateExpenseValue(val))
      msg = "Insira um valor maior que zero";
    if (campo === "categoria" && !val.trim()) msg = "A categoria é obrigatória";
    if (campo === "descricao" && !val.trim()) msg = "A descrição é obrigatória";

    setErrors((prev) => ({ ...prev, [campo]: msg }));
    return !msg;
  }, []);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) return;
    const isValorValid = validate("valor", valor);
    const isCatValid = validate("categoria", categoria);
    const isDescValid = validate("descricao", descricao);

    if (isValorValid && isCatValid && isDescValid) {
      setIsSubmitting(true);
      try {
        await onSave(
          categoria,
          valor,
          emojiSelecionado,
          descricao,
          initialData?.id_financas,
        );
      } catch (error) {
        console.error("Erro ao processar requisição:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    validate,
    valor,
    categoria,
    emojiSelecionado,
    descricao,
    onSave,
    initialData,
    isSubmitting,
  ]);

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

  const handleDescricaoChange = useCallback(
    (e) => {
      setDescricao(e.target.value);
      if (errors.descricao) setErrors((prev) => ({ ...prev, descricao: "" }));
    },
    [errors.descricao],
  );

  const displayValor = useMemo(
    () => (valor > 0 ? formatToBRL(valor).replace("R$", "").trim() : ""),
    [valor],
  );

  const emojiGrid = useMemo(
    () => (
      <div className="w-full flex justify-center pt-1">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3 max-h-28 sm:max-h-36 overflow-y-auto pr-2 custom-scrollbar py-1">
          {FINANCE_EMOJIS.map((item) => (
            <motion.button
              key={item.label}
              type="button"
              title={item.label}
              aria-label={`Selecionar ícone de ${item.label}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEmojiSelecionado(item.icon)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-colors border-2 shadow-sm
              ${
                emojiSelecionado === item.icon
                  ? "bg-orange border-orange"
                  : "bg-white border-orange/30 hover:border-orange"
              }`}
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
      </div>
    ),
    [emojiSelecionado],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !isSubmitting && onClose()}
      className="fixed inset-0 z-50 flex px-4 pt-[40px] sm:pt-[60px] items-center justify-center bg-black/50 will-change-opacity"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[600px] bg-white rounded-[24px] sm:rounded-[32px] flex flex-col items-center py-4 sm:py-6 px-5 sm:px-8 shadow-2xl border border-orange-100 will-change-transform max-h-[85vh] overflow-y-auto custom-scrollbar"
      >
        <h1 className="text-xl sm:text-2xl font-black text-brown-dark mb-3 sm:mb-4 text-center">
          {is_edit_expenses ? "Editar gastos" : "Adicionar gastos"}
        </h1>

        <div className="flex flex-col items-center w-full mb-3 sm:mb-4">
          <div
            className={`flex items-end gap-2 border-b-2 transition-colors px-2 sm:px-4 pb-1 w-full max-w-[180px] sm:max-w-[220px] justify-center ${
              errors.valor ? "border-red-500" : "border-orange"
            }`}
          >
            <input
              type="text"
              inputMode="decimal"
              value={displayValor}
              onChange={handleValorChange}
              onBlur={() => validate("valor", valor)}
              className="w-full outline-none text-orange text-3xl  font-black bg-transparent text-center placeholder:text-orange/20"
              placeholder="0,00"
              disabled={isSubmitting}
            />
            <span className="text-orange text-base sm:text-lg font-bold mb-1 sm:mb-2">
              BRL
            </span>
          </div>
          <AnimatePresence>
            {errors.valor && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-red-500 text-xs font-bold mt-1 uppercase overflow-hidden"
              >
                {errors.valor}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full bg-[#FFF4D1] rounded-[20px] sm:rounded-[24px] p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-inner">
          <div className="w-full flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col items-center w-full relative">
              <input
                type="text"
                placeholder="Nome da categoria"
                className={`w-full h-10 sm:h-12 rounded-full outline-none border-2 px-4 sm:px-5 text-sm sm:text-base font-bold bg-white transition-colors ${
                  errors.categoria
                    ? "border-red-400"
                    : "border-transparent focus:border-orange"
                }`}
                value={categoria}
                maxLength={50}
                onChange={handleCategoriaChange}
                onBlur={() => validate("categoria", categoria)}
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {errors.categoria && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-500 text-xs font-bold mt-1 uppercase overflow-hidden absolute -bottom-5"
                  >
                    {errors.categoria}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center w-full relative mt-1 sm:mt-0">
              <textarea
                placeholder="Descrição"
                rows={2}
                className={`w-full min-h-[60px] sm:min-h-[80px] max-h-[120px] rounded-xl outline-none border-2 px-4 sm:px-5 py-2 text-sm sm:text-base font-bold bg-white transition-colors resize-none custom-scrollbar ${
                  errors.descricao
                    ? "border-red-400"
                    : "border-transparent focus:border-orange"
                }`}
                value={descricao}
                onChange={handleDescricaoChange}
                onBlur={() => validate("descricao", descricao)}
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {errors.descricao && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-500 text-xs font-bold mt-1 uppercase overflow-hidden absolute -bottom-5"
                  >
                    {errors.descricao}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          {emojiGrid}
        </div>

        <div className="flex gap-3 sm:gap-6 mt-4 w-full justify-center">
          <DefaultButton
            onClick={onClose}
            text="Cancelar"
            another_size={"h-10 w-28 sm:h-12 sm:w-36 text-sm"}
            theme={false}
            disabled={isSubmitting}
          />
          <DefaultButton
            onClick={handleConfirm}
            another_size={"h-10 w-28 sm:h-12 sm:w-36 text-sm"}
            text={
              isSubmitting
                ? "Salvando..."
                : is_edit_expenses
                  ? "Salvar"
                  : "Adicionar"
            }
            disabled={isSubmitting}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddExpenses;
