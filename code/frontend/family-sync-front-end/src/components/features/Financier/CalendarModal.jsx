import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chevronDownBrownIcon } from "../../../assets";

const mesesNomes = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function CalendarModal({
  isOpen,
  onClose,
  diasComGastos,
  dataFiltroDia,
  onSelectDate,
}) {
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);

  // 🚀 OTIMIZAÇÃO 1: Transforma o array em Set para verificações super rápidas O(1)
  const diasComGastosSet = useMemo(
    () => new Set(diasComGastos),
    [diasComGastos],
  );

  // 🚀 OTIMIZAÇÃO 2: Formata a data do filtro usando o fuso local (evitando bugs do toISOString)
  const dataFiltroStr = useMemo(() => {
    if (!dataFiltroDia) return "";
    const ano = dataFiltroDia.getFullYear();
    const mes = String(dataFiltroDia.getMonth() + 1).padStart(2, "0");
    const dia = String(dataFiltroDia.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }, [dataFiltroDia]);

  const { hojeStr, mesHojeStr } = useMemo(() => {
    const hojeObj = new Date();
    const ano = hojeObj.getFullYear();
    const mes = String(hojeObj.getMonth() + 1).padStart(2, "0");
    const dia = String(hojeObj.getDate()).padStart(2, "0");
    return {
      hojeStr: `${ano}-${mes}-${dia}`,
      mesHojeStr: `${ano}-${mes}`,
    };
  }, []);

  const mesesDisponiveis = useMemo(() => {
    const meses = (diasComGastos || []).map((data) => data.substring(0, 7));
    if (!meses.includes(mesHojeStr)) {
      meses.push(mesHojeStr);
    }
    return [...new Set(meses)].sort();
  }, [diasComGastos, mesHojeStr]);

  const [mesAtualStr, setMesAtualStr] = useState(() => {
    if (!dataFiltroDia) return mesHojeStr;
    const ano = dataFiltroDia.getFullYear();
    const mes = String(dataFiltroDia.getMonth() + 1).padStart(2, "0");
    const dataAtualStr = `${ano}-${mes}`;

    if (mesesDisponiveis.includes(dataAtualStr)) return dataAtualStr;
    return mesesDisponiveis.length > 0
      ? mesesDisponiveis[mesesDisponiveis.length - 1]
      : dataAtualStr;
  });

  useEffect(() => {
    if (!dataFiltroDia) return;
    const ano = dataFiltroDia.getFullYear();
    const mes = String(dataFiltroDia.getMonth() + 1).padStart(2, "0");
    const str = `${ano}-${mes}`;

    if (mesesDisponiveis.includes(str)) {
      setMesAtualStr(str);
    }
  }, [dataFiltroDia, mesesDisponiveis]);

  // 🚀 OTIMIZAÇÃO 3: Calcula a grade do calendário apenas quando o mês muda
  const { diasGrade, ano, mes } = useMemo(() => {
    const [anoStr, mesStr] = mesAtualStr.split("-");
    const a = parseInt(anoStr, 10);
    const m = parseInt(mesStr, 10) - 1;

    const diasNoMes = new Date(a, m + 1, 0).getDate();
    const primeiroDiaSemana = new Date(a, m, 1).getDay();

    const grade = [];
    for (let i = 0; i < primeiroDiaSemana; i++) {
      grade.push(null);
    }
    for (let i = 1; i <= diasNoMes; i++) {
      const diaFormatado = String(i).padStart(2, "0");
      grade.push(`${anoStr}-${mesStr}-${diaFormatado}`);
    }
    return { diasGrade: grade, ano: a, mes: m };
  }, [mesAtualStr]);

  const toggleMonthSelector = () =>
    setIsMonthSelectorOpen(!isMonthSelectorOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#F9F9F9] w-full max-w-sm rounded-3xl shadow-2xl p-6 flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Fechar calendário"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold transition-colors"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-[#4a2511] mb-4 text-center mt-2">
          Selecione a Data
        </h3>

        <div className="relative w-full bg-white rounded-lg shadow-sm mb-6 overflow-hidden border border-gray-100">
          <div
            className="relative p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={toggleMonthSelector}
            aria-expanded={isMonthSelectorOpen}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-[#4a2511] font-bold text-lg">Mês:</h3>
              <span className="text-orange font-medium text-lg capitalize">
                {mesesNomes[mes]} {ano}
              </span>
            </div>
            <motion.img
              src={chevronDownBrownIcon}
              alt="Abrir seletor de mês"
              animate={{ rotate: isMonthSelectorOpen ? 180 : 0 }}
              className="w-6 h-6 object-contain"
            />
          </div>

          <AnimatePresence>
            {isMonthSelectorOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="relative overflow-hidden"
              >
                <div className="relative px-4 pb-4 border-t border-gray-100 pt-3 flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {mesesDisponiveis.map((mDisponivel) => {
                    const [y, mStr] = mDisponivel.split("-");
                    const isSelected = mDisponivel === mesAtualStr;
                    return (
                      <div
                        key={mDisponivel}
                        className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-md transition-colors"
                        onClick={() => {
                          setMesAtualStr(mDisponivel);
                          setIsMonthSelectorOpen(false);
                        }}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-orange" : "border-[#4a2511]/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 bg-orange rounded-full" />
                          )}
                        </div>
                        <span
                          className={
                            isSelected
                              ? "text-orange font-bold text-lg capitalize"
                              : "text-[#4a2511] font-medium text-lg capitalize"
                          }
                        >
                          {mesesNomes[parseInt(mStr, 10) - 1]} {y}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 font-bold text-sm">
          <span>D</span>
          <span>S</span>
          <span>T</span>
          <span>Q</span>
          <span>Q</span>
          <span>S</span>
          <span>S</span>
        </div>

        <div className="relative grid grid-cols-7 gap-2">
          {diasGrade.map((dataString, index) => {
            if (!dataString) return <div key={`empty-${index}`} />;

            const diaNumero = dataString.split("-")[2];
            const temGasto = diasComGastosSet.has(dataString);
            const isHoje = dataString === hojeStr;
            const isSelecionado = dataFiltroStr === dataString;

            const podeClicar = temGasto || isHoje;

            return (
              <button
                key={dataString}
                disabled={!podeClicar}
                onClick={() => {
                  const [y, mStr, d] = dataString.split("-");
                  onSelectDate(new Date(y, parseInt(mStr, 10) - 1, d));
                }}
                className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-full text-sm font-bold transition-all ${
                  isSelecionado
                    ? "bg-orange text-white shadow-md"
                    : isHoje && !temGasto
                      ? "border-2 border-orange text-orange hover:bg-orange-100 cursor-pointer"
                      : temGasto
                        ? "bg-gray-200 text-[#4a2511] hover:bg-orange-200 hover:text-orange cursor-pointer"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                }`}
              >
                {diaNumero}
                {temGasto && !isSelecionado && (
                  <span className="absolute bottom-1 w-1 h-1 bg-orange rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
