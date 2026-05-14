import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dollarIcon, sortDownIcon } from "../../assets";

const FinancialSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-58" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-white border-2 border-orange rounded-4xl px-6 py-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <img src={dollarIcon} alt="Moeda" className="w-8 h-8" />
          <span className="text-2xl text-orange font-bold capitalize">
            {value}
          </span>
        </div>

        <motion.img
          src={sortDownIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full w-full bg-white border-2 border-orange rounded-2xl z-50 overflow-hidden shadow-xl"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-6 py-3 text-xl font-bold cursor-pointer transition-colors capitalize
                  ${
                    value === opt
                      ? "bg-orange text-white"
                      : "text-brown-dark hover:bg-orange/10"
                  }`}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialSelect;
