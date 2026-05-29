import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import LargeCard from "../../ui/LargeCard.jsx";
import MainLayout from "../../../layouts/MainLayout.jsx";
import DefaultButton from "../../ui/DefaultButton.jsx";
import AddExpenses from "./AddExpenses.jsx";
import { ExpenseListModal } from "./ExpenseListModal.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";

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
}) {
  const isScrollable = chartData.length > 8;

  const topScrollRef = useRef(null);
  const chartScrollRef = useRef(null);

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
                  onClick={() => setPeriodo(item)}
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

            <div className="text-orange font-semibold mt-6 mb-5 text-xl">
              {labelsData[periodo]}
            </div>

            {isScrollable && (
              <div
                ref={topScrollRef}
                onScroll={() => {
                  if (chartScrollRef.current && topScrollRef.current) {
                    chartScrollRef.current.scrollLeft =
                      topScrollRef.current.scrollLeft;
                  }
                }}
                className="w-full overflow-x-auto custom-scrollbar mb-2 h-6"
                style={{ paddingLeft: "48px" }}
              >
                <div
                  className="flex gap-20 px-4"
                  style={{ width: `${chartData.length * 136}px` }}
                >
                  {chartData.map((item) => (
                    <div key={item.id_financas} className="w-14 shrink-0" />
                  ))}
                </div>
              </div>
            )}

            <div className="relative w-full max-w-300 h-150 mt-2 mb-18 group">
              <div className="absolute inset-0 flex flex-col justify-between z-0">
                {yAxisValues.map((val, i) => (
                  <div key={i} className="flex items-center w-full h-0">
                    <span className="text-[16px] text-gray-800 font-medium w-12 text-right pr-3 bg-white z-10">
                      {val}
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 left-12 border-l border-gray-300"></div>
              </div>

              <div
                ref={chartScrollRef}
                onScroll={() => {
                  if (topScrollRef.current && chartScrollRef.current) {
                    topScrollRef.current.scrollLeft =
                      chartScrollRef.current.scrollLeft;
                  }
                }}
                className={`absolute top-0 -bottom-16 left-12 scroll-smooth right-0 z-10 flex items-end pb-16 overflow-x-auto px-4 ${
                  isScrollable
                    ? "justify-start gap-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    : "justify-evenly w-full"
                }`}
              >
                {chartData.map((item, index) => {
                  const idFinanca = item.id_financas;
                  const valorItem = item.valorItem;
                  let labelItem = item.labelItem;

                  if (labelItem && labelItem.length > 22) {
                    labelItem = labelItem.substring(0, 22) + "...";
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
                      className="relative w-14 h-full flex flex-col justify-end items-center group shrink-0"
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
                            className="absolute top-full -mt-60 z-50 w-52 bg-white border border-orange-200 shadow-2xl rounded-2xl p-4 flex flex-col items-center"
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
                                className="mt-2 text-[12px] text-red-500 hover:underline font-bold uppercase"
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

                      <span className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-[16px] font-bold text-[#5B3E31] text-center w-28 break-words leading-tight">
                        {labelItem}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-10 mt-4 z-10">
              <DefaultButton
                text="Editar"
                another_size="h-14 w-40"
                onClick={handleOpenFullList}
                theme={false}
              />
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
              onClose={() => setIsListModalOpen(false)}
              onDayClick={handleDayClick}
              dataFiltroDia={dataFiltroDia}
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
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default FinancierView;
