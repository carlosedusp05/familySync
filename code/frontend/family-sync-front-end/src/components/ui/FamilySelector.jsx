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
    <div className="w-full bg-white rounded-lg shadow-sm mt-2 overflow-hidden flex-shrink-0">
      <div
        className="p-3 sm:p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleOpen}
      >
        {/* Adicionado min-w-0 e flex-1 para o texto não empurrar a seta para fora */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <h3 className="text-[#4a2511] font-bold text-sm sm:text-xl whitespace-nowrap">
            Minha Família:
          </h3>
          <span className="text-orange font-medium text-xs sm:text-lg truncate flex-1">
            {disponiveis.find((f) => selecionadas.includes(f.id))?.nome ||
              "Selecione..."}
          </span>
        </div>

        <motion.img
          src={chevronDownBrownIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain ml-2 flex-shrink-0"
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 pt-2 sm:pt-3 flex flex-col gap-1 overflow-hidden"
          >
            {disponiveis.map((fam) => (
              <div
                key={fam.id}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                onClick={() => onSelect(fam.id)}
              >
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selecionadas.includes(fam.id)
                      ? "border-orange"
                      : "border-[#4a2511]/30"
                  }`}
                >
                  {selecionadas.includes(fam.id) && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange rounded-full" />
                  )}
                </div>
                <span
                  className={`truncate ${
                    selecionadas.includes(fam.id)
                      ? "text-orange font-bold text-sm sm:text-lg"
                      : "text-[#4a2511] font-medium text-sm sm:text-lg"
                  }`}
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
