import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import LargeCard from "../../ui/LargeCard.jsx";
import MainLayout from "../../../layouts/MainLayout.jsx";
import DefaultButton from "../../ui/DefaultButton.jsx";
import AddExpenses from "./AddExpenses.jsx";
import { ExpenseListModal } from "./ExpenseListModal.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import CalendarModal from "./CalendarModal.jsx";

// Certifique-se de que o caminho do ícone está correto de acordo com seu projeto
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

function FinancierView({
  PERIODOS,
  OPCOES_VISUALIZACAO,
  periodo,
  setPeriodo,
  hoveredIndex,
  setHoveredIndex,
  tipoVisualizacao,
  setTipoVisualizacao,
  isFormModalOpen,
  setIsFormModalOpen,
  isListModalOpen,
  setIsListModalOpen,
  expenseToEdit,
  setExpenseToEdit,
  authorName,
  chartData,
  selectedExpenses,
  totalGasto,
  valorMaximo,
  yAxisValues,
  labelsData,
  handleDeleteExpense,
  handleSaveExpense,
  handleOpenAddForm,
  handleBarClick,
  handleOpenFullList,
  isLoading,
  handleDayClick,
  dataFiltroDia,
  isCalendarOpen,
  setIsCalendarOpen,
  diasComGastos,
  onSelectDate,
  dataResponsivaModal,
}) {
  const isScrollable = chartData.length > 8;

  const topScrollRef = useRef(null);
  const chartScrollRef = useRef(null);

  const [isMainMonthSelectorOpen, setIsMainMonthSelectorOpen] = useState(false);
  const [isMainYearSelectorOpen, setIsMainYearSelectorOpen] = useState(false);

  const mesAtualStr = useMemo(() => {
    if (!dataFiltroDia) return "";
    const ano = dataFiltroDia.getFullYear();
    const mes = String(dataFiltroDia.getMonth() + 1).padStart(2, "0");
    return `${ano}-${mes}`;
  }, [dataFiltroDia]);

  const { anoAtual, mesAtualIndex } = useMemo(() => {
    if (!mesAtualStr) {
      return {
        anoAtual: new Date().getFullYear(),
        mesAtualIndex: new Date().getMonth(),
      };
    }
    const [anoStr, mesStr] = mesAtualStr.split("-");
    return {
      anoAtual: parseInt(anoStr, 10),
      mesAtualIndex: parseInt(mesStr, 10) - 1,
    };
  }, [mesAtualStr]);

  const mesHojeStr = useMemo(() => {
    const hojeObj = new Date();
    return `${hojeObj.getFullYear()}-${String(hojeObj.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const mesesDisponiveis = useMemo(() => {
    const meses = diasComGastos
      ? diasComGastos.map((data) => data.substring(0, 7))
      : [];
    if (!meses.includes(mesHojeStr)) {
      meses.push(mesHojeStr);
    }
    return [...new Set(meses)].sort();
  }, [diasComGastos, mesHojeStr]);

  const anosDisponiveis = useMemo(() => {
    const anos = diasComGastos
      ? diasComGastos.map((data) => data.substring(0, 4))
      : [];
    const anoHojeStr = new Date().getFullYear().toString();
    if (!anos.includes(anoHojeStr)) {
      anos.push(anoHojeStr);
    }
    return [...new Set(anos)].sort((a, b) => b.localeCompare(a));
  }, [diasComGastos]);

  const obterTituloModal = () => {
    if (periodo === "Semana") return "Gastos por Dia";
    if (periodo === "Mês") return "Gastos por Semana";
    if (periodo === "Ano") return "Gastos por Mês";
    return "Detalhes dos Gastos";
  };

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <LargeCard size="h-[90%] w-[57%]" display="flex justify-center">
          <div className="w-full h-full flex flex-col items-center bg-white p-10 rounded-3xl relative">
            <div className="flex flex-col items-center mb-6">
              <span className="text-orange font-bold uppercase tracking-wider text-[18px] mb-1">
                Gastos do {periodo}
              </span>
              <h2 className="text-brown-dark font-extrabold text-[40px]">
                R${" "}
                {totalGasto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="w-full flex items-center justify-center gap-50 mt-4 px-10">
              {PERIODOS.map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center cursor-pointer relative"
                  onClick={() => {
                    setPeriodo(item);
                    setIsMainMonthSelectorOpen(false);
                    setIsMainYearSelectorOpen(false);
                  }}
                >
                  <span
                    className={`text-2xl pb-2 transition-colors ${
                      periodo === item
                        ? "text-orange font-bold"
                        : "text-orange font-medium"
                    }`}
                  >
                    {item}
                  </span>
                  {periodo === item && (
                    <motion.div
                      layoutId="periodo-underline"
                      className="absolute bottom-0 h-1 w-full bg-orange"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-orange font-semibold mt-6 mb-5 text-xl relative flex justify-center w-full z-30">
              {periodo === "Dia" || periodo === "Semana" ? (
                <button
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-50 border border-orange/30 rounded-full hover:bg-orange hover:text-white transition-all shadow-sm active:scale-95 group"
                >
                  <span>{labelsData[periodo]}</span>
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    📅
                  </span>
                </button>
              ) : periodo === "Mês" ? (
                <div className="relative w-64 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div
                    className="relative p-3 px-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors"
                    onClick={() =>
                      setIsMainMonthSelectorOpen(!isMainMonthSelectorOpen)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#4a2511] font-bold text-base">
                        Mês:
                      </h3>
                      <span className="text-orange font-semibold text-base capitalize">
                        {mesesNomes[mesAtualIndex]} {anoAtual}
                      </span>
                    </div>
                    <motion.img
                      src={chevronDownBrownIcon}
                      animate={{ rotate: isMainMonthSelectorOpen ? 180 : 0 }}
                      className="w-5 h-5 object-contain"
                    />
                  </div>

                  <AnimatePresence>
                    {isMainMonthSelectorOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="absolute left-0 right-0 top-[105%] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                          {mesesDisponiveis.map((mDisponivel) => {
                            const [y, m] = mDisponivel.split("-");
                            const isSelected = mDisponivel === mesAtualStr;
                            return (
                              <div
                                key={mDisponivel}
                                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-xl transition-colors"
                                onClick={() => {
                                  const novaData = new Date(
                                    parseInt(y, 10),
                                    parseInt(m, 10) - 1,
                                    1,
                                  );

                                  if (onSelectDate) {
                                    onSelectDate(novaData);
                                  } else if (handleDayClick) {
                                    handleDayClick({ exactDate: novaData });
                                  }

                                  setPeriodo("Mês");
                                  setIsMainMonthSelectorOpen(false);
                                }}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-orange"
                                      : "border-[#4a2511]/30"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-orange rounded-full" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm capitalize ${
                                    isSelected
                                      ? "text-orange font-bold"
                                      : "text-[#4a2511] font-medium"
                                  }`}
                                >
                                  {mesesNomes[parseInt(m, 10) - 1]} {y}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : periodo === "Ano" ? (
                <div className="relative w-64 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div
                    className="relative p-3 px-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors"
                    onClick={() =>
                      setIsMainYearSelectorOpen(!isMainYearSelectorOpen)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#4a2511] font-bold text-base">
                        Ano:
                      </h3>
                      <span className="text-orange font-semibold text-base">
                        {anoAtual}
                      </span>
                    </div>
                    <motion.img
                      src={chevronDownBrownIcon}
                      animate={{ rotate: isMainYearSelectorOpen ? 180 : 0 }}
                      className="w-5 h-5 object-contain"
                    />
                  </div>

                  <AnimatePresence>
                    {isMainYearSelectorOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="absolute left-0 right-0 top-[105%] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                          {anosDisponiveis.map((ano) => {
                            const isSelected = ano === String(anoAtual);
                            return (
                              <div
                                key={ano}
                                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-orange-50 rounded-xl transition-colors"
                                onClick={() => {
                                  // Seta para 1º de Janeiro do ano selecionado para não quebrar a lógica do `dataFiltroDia`
                                  const novaData = new Date(
                                    parseInt(ano, 10),
                                    0, // Janeiro
                                    1, // Dia 1
                                  );

                                  if (onSelectDate) {
                                    onSelectDate(novaData);
                                  } else if (handleDayClick) {
                                    handleDayClick({ exactDate: novaData });
                                  }

                                  setPeriodo("Ano");
                                  setIsMainYearSelectorOpen(false);
                                }}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-orange"
                                      : "border-[#4a2511]/30"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-orange rounded-full" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm ${
                                    isSelected
                                      ? "text-orange font-bold"
                                      : "text-[#4a2511] font-medium"
                                  }`}
                                >
                                  {ano}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <span className="px-5 py-2">{labelsData[periodo]}</span>
              )}
            </div>

            <div className="flex flex-col w-full max-w-[900px]  items-center z-10">
              {isScrollable && (
                <div
                  ref={topScrollRef}
                  onScroll={(e) => {
                    if (chartScrollRef.current) {
                      chartScrollRef.current.scrollLeft =
                        e.currentTarget.scrollLeft;
                    }
                  }}
                  className="w-full pl-14 overflow-x-auto custom-scrollbar mb-2"
                >
                  <div className="flex justify-start gap-12 sm:gap-16 pr-8 h-px">
                    {chartData.map((item) => (
                      <div
                        key={`dummy-${item.id_financas}`}
                        className="w-12 sm:w-16 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="relative w-full h-[340px] flex">
                <div className="w-14 h-full flex flex-col justify-between pb-12 z-0 border-r border-gray-300">
                  {yAxisValues.map((val, i) => (
                    <span
                      key={`y-${i}`}
                      className="text-[14px] text-gray-800 font-medium text-right pr-3"
                    >
                      {val}
                    </span>
                  ))}
                </div>

                <div className="absolute top-0 right-0 left-14 bottom-12 flex flex-col justify-between pointer-events-none z-0">
                  {yAxisValues.map((_, i) => (
                    <div
                      key={`grid-${i}`}
                      className="w-full border-t border-gray-300"
                    />
                  ))}
                </div>

                <div
                  ref={chartScrollRef}
                  onScroll={(e) => {
                    if (topScrollRef.current) {
                      topScrollRef.current.scrollLeft =
                        e.currentTarget.scrollLeft;
                    }
                  }}
                  className={`flex-1 h-full overflow-x-auto overflow-y-visible flex items-end pb-12 z-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    isScrollable
                      ? "justify-start gap-12 sm:gap-16 pr-8 pl-4"
                      : "justify-evenly gap-4"
                  }`}
                >
                  {chartData.map((item, index) => {
                    const idFinanca = item.id_financas;
                    const valorItem = item.valorItem;
                    let labelItem = item.labelItem;

                    if (labelItem && labelItem.length > 23) {
                      labelItem = labelItem.substring(0, 23) + "...";
                    }

                    const alturaBarra =
                      valorMaximo > 0 ? (valorItem / valorMaximo) * 100 : 0;
                    const percent =
                      totalGasto > 0
                        ? ((valorItem / totalGasto) * 100).toFixed(1)
                        : 0;

                    return (
                      <div
                        key={idFinanca}
                        className="relative w-12 sm:w-16 h-full flex flex-col justify-end items-center group shrink-0"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => handleBarClick(item)}
                      >
                        <AnimatePresence>
                          {hoveredIndex === index && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute bottom-full mb-2 z-50 w-48 bg-white border border-orange-200 shadow-2xl rounded-2xl p-4 flex flex-col items-center pointer-events-none"
                            >
                              <span className="text-4xl mb-2">
                                {item.icone || "💰"}
                              </span>
                              <p className="text-xl font-black text-brown-dark">
                                R${" "}
                                {valorItem.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">
                                Adicionado por:
                              </p>
                              <p className="text-xs text-center text-gray-700">
                                {authorName}
                              </p>
                              <div className="w-full h-px bg-gray-100 my-2" />
                              <p className="text-orange font-black text-lg">
                                {percent}%
                              </p>
                              {!item.isGroup && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteExpense(idFinanca);
                                  }}
                                  className="mt-2 text-[12px] text-red-500 hover:underline font-bold uppercase pointer-events-auto"
                                >
                                  Excluir
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div
                          className="w-full bg-gradient-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] cursor-pointer hover:brightness-110 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${alturaBarra}%` }}
                          transition={{
                            duration: 0.6,
                            type: "spring",
                            bounce: 0.3,
                          }}
                        />

                        <span className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-[14px] font-bold text-[#5B3E31] text-center w-24 break-words leading-tight">
                          {labelItem}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-10 mt-4 z-10">
              {periodo != "Ano" ? (
                <DefaultButton
                  text="Editar"
                  another_size="h-14 w-40"
                  onClick={handleOpenFullList}
                  theme={false}
                />
              ) : (
                ""
              )}

              <DefaultButton
                text="Incluir"
                another_size="h-14 w-40"
                onClick={handleOpenAddForm}
              />
            </div>
          </div>
        </LargeCard>

        <AnimatePresence>
          {isListModalOpen && (
            <ExpenseListModal
              isOpen={isListModalOpen}
              expenses={selectedExpenses}
              title={obterTituloModal()}
              periodo={periodo}
              diasComGastos={diasComGastos}
              onClose={() => setIsListModalOpen(false)}
              onDayClick={handleDayClick}
              dataFiltroDia={dataResponsivaModal}
              onDelete={handleDeleteExpense}
              onEdit={(item) => {
                setExpenseToEdit(item);
                setIsListModalOpen(false);
                setIsFormModalOpen(true);
              }}
              onAdd={handleOpenAddForm}
            />
          )}
          {isFormModalOpen && (
            <AddExpenses
              is_edit_expenses={!!expenseToEdit}
              initialData={expenseToEdit}
              onClose={() => {
                setIsFormModalOpen(false);
                setExpenseToEdit(null);
              }}
              onSave={handleSaveExpense}
            />
          )}
          {isCalendarOpen && (
            <CalendarModal
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              diasComGastos={diasComGastos}
              dataFiltroDia={dataFiltroDia}
              onSelectDate={(novaData) => {
                handleDayClick({ exactDate: novaData });
                setIsCalendarOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default FinancierView;
