import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chevronDownBrownIcon } from "../../../assets";

const estadosBrasil = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

function SelectAddFamily({ w, error, value, onChange, onBlur, id, onKeyDown }) {
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

  const filteredEstados = estadosBrasil.filter(
    (estado) =>
      estado.sigla.toLowerCase().includes(value?.toLowerCase() || "") ||
      estado.nome.toLowerCase().includes(value?.toLowerCase() || ""),
  );

  const handleSelect = (sigla) => {
    onChange({ target: { id, value: sigla } });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const apenasLetras = e.target.value.replace(/[^a-zA-Z]/g, "");
    const val = apenasLetras.toUpperCase().slice(0, 2);

    onChange({ target: { id, value: val } });
    setIsOpen(val.length < 2);
  };

  const handleInputBlur = (e) => {
    if (value) {
      const valUpper = value.toUpperCase();

      const exactMatch = estadosBrasil.find(
        (estado) => estado.sigla === valUpper,
      );

      if (!exactMatch) {
        const closestMatch =
          estadosBrasil.find((estado) => estado.sigla.startsWith(valUpper)) ||
          filteredEstados[0];

        if (closestMatch) {
          onChange({ target: { id, value: closestMatch.sigla } });
        } else {
          onChange({ target: { id, value: "" } });
        }
      }
    }

    setIsOpen(false);
    if (onBlur) onBlur(e);
  };

  const toggleDropdown = () => {
    if ((value || "").length < 2) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`flex flex-col gap-1 relative ${w}`} ref={containerRef}>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          placeholder="UF"
          value={value || ""}
          onChange={handleInputChange}
          onFocus={() => (value || "").length < 2 && setIsOpen(true)}
          onBlur={handleInputBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
          className={`flex p-3 text-[20px] border-2 rounded-4xl px-6 w-full text-black  bg-white focus:outline-none transition-all placeholder:text-gray-400 ${
            error ? "border-red-500" : "border-orange"
          }`}
        />

        <motion.img
          src={chevronDownBrownIcon}
          onClick={toggleDropdown}
          animate={{
            rotate: isOpen && (value || "").length < 2 ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
          className={`w-5 h-5 absolute right-5  ${
            (value || "").length >= 2 ? "cursor-default" : "cursor-pointer"
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (value || "").length < 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 top-full w-full bg-white border-2 border-orange rounded-2xl z-50 max-h-48 overflow-y-auto shadow-xl [&::-webkit-scrollbar]:w-4
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md"
          >
            {filteredEstados.length > 0 ? (
              filteredEstados.map((estado) => (
                <div
                  key={estado.sigla}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(estado.sigla);
                  }}
                  className="hover:bg-orange/20 cursor-pointer text-xl py-2 px-6 text-brown-dark flex justify-between items-center transition-colors"
                >
                  <span className="font-bold">{estado.sigla}</span>
                </div>
              ))
            ) : (
              <div className="py-2 px-6 text-gray-400 text-sm">
                Nenhum resultado
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          error ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <span className="text-red-500 text-sm px-4 block">{error}</span>
      </div>
    </div>
  );
}

export default SelectAddFamily;
