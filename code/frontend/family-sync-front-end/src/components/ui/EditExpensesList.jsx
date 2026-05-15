import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import DefaultButton from "./DefaultButton";

const ExpenseItem = memo(({ item, totalGasto, onEdit, onDelete }) => {
  const percent =
    totalGasto > 0 ? ((item.valor / totalGasto) * 100).toFixed(0) : 0;
  const formattedValue = item.valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
  const handleDelete = useCallback(
    () => onDelete(item.id),
    [item.id, onDelete],
  );

  return (
    <div className="bg-white rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <span className="bg-orange/20 p-2 rounded-lg text-xl">
          {item.emoji}
        </span>
        <span className="font-semibold text-brown-dark">{item.label}</span>
      </div>

      <span className="text-brown-dark font-medium w-1/6 text-center">
        {percent}%
      </span>

      <span className="font-bold text-brown-dark w-1/4 text-right">
        R$ {formattedValue}
      </span>

      <div className="flex gap-3 ml-4">
        <button
          onClick={handleEdit}
          className="text-orange hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="text-orange hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
});

ExpenseItem.displayName = "ExpenseItem";

const EditExpensesList = memo(
  ({ expenses, totalGasto, onClose, onEdit, onDelete, onAdd }) => {
    const handleStopPropagation = useCallback((e) => e.stopPropagation(), []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "linear" }}
        onClick={onClose}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
        style={{ willChange: "opacity" }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleStopPropagation}
          style={{ willChange: "transform, opacity" }}
          className="w-200 bg-linear-to-b from-[#FFF5F0] to-[#FFE8DE] rounded-3xl py-8 px-10 shadow-2xl flex flex-col"
        >
          <div className="flex flex-col gap-3 mb-8 max-h-75 overflow-y-auto pr-2 custom-scrollbar transform-gpu">
            {expenses.length === 0 ? (
              <p className="text-center text-brown-dark font-medium">
                Nenhum gasto neste período.
              </p>
            ) : (
              expenses.map((item) => (
                <ExpenseItem
                  key={item.id}
                  item={item}
                  totalGasto={totalGasto}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>

          <div className="flex gap-4 w-full justify-end">
            <DefaultButton
              onClick={onClose}
              text="Voltar"
              theme={false}
              another_size="h-12 w-32 text-sm"
            />
            <DefaultButton
              onClick={onAdd}
              text="Adicionar"
              another_size="h-12 w-32 text-sm bg-[#FFF4D1] text-orange hover:bg-[#FFE8A1]"
            />
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

EditExpensesList.displayName = "EditExpensesList";

export default EditExpensesList;
