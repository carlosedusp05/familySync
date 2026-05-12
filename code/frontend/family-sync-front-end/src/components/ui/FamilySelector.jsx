import { motion, AnimatePresence } from "framer-motion";
import { chevronDownBrownIcon } from "../../assets";

function FamilySelector({
  isOpen,
  toggleOpen,
  disponiveis,
  selecionadas,
  onSelect,
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm mt-2 overflow-hidden">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[#4a2511] font-bold text-xl">Minha Família:</h3>
          <span className="text-orange font-medium text-lg truncate max-w-37.5">
            {disponiveis.find((f) => selecionadas.includes(f.id))?.nome ||
              "Selecione..."}
          </span>
        </div>
        <motion.img
          src={chevronDownBrownIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-8 h-8 object-contain"
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="px-4 pb-4 border-t border-gray-100 pt-3 flex flex-col gap-1"
          >
            {disponiveis.map((fam) => (
              <div
                key={fam.id}
                className="flex items-center gap-3 cursor-pointer p-2"
                onClick={() => onSelect(fam.id)}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selecionadas.includes(fam.id) ? "border-orange" : "border-[#4a2511]/30"}`}
                >
                  {selecionadas.includes(fam.id) && (
                    <div className="w-2.5 h-2.5 bg-orange rounded-full" />
                  )}
                </div>
                <span
                  className={
                    selecionadas.includes(fam.id)
                      ? "text-orange font-bold text-lg"
                      : "text-[#4a2511] font-medium text-lg"
                  }
                >
                  {fam.nome}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FamilySelector;
