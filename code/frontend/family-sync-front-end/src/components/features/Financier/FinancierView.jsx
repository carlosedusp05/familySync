import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import LargeCard from "../../ui/LargeCard.jsx";
import MainLayout from "../../../layouts/MainLayout.jsx";
import DefaultButton from "../../ui/DefaultButton.jsx";
import AddExpenses from "./AddExpenses.jsx";
import { ExpenseListModal } from "./ExpenseListModal.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import CalendarModal from "./CalendarModal.jsx";
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

const PIE_COLORS = [
  "#FFB382",
  "#FF8C42",
  "#DFB3CD",
  "#C08497",
  "#F7AF9D",
  "#F7E3AF",
  "#B0D0D3",
  "#9E90A2",
];

const getCoordinatesForPercent = (percent) => {
  const x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
  const y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
  return [x, y];
};

const ChartPopup = memo(
  ({
    item,
    percent,
    isMobile,
    clickPosition,
    popupRef,
    periodo,
    authorName,
    onEdit,
    onDelete,
    alturaBarra,
  }) => {
    const nomeGasto =
      item.labelItem || item.descricao || item.description || "Gasto";

    const baseClasses =
      "z-50 w-32 md:w-36 bg-white border border-orange-200 shadow-xl rounded-xl p-2 flex flex-col items-center pointer-events-auto";

    let containerClasses = baseClasses;
    let inlineStyle = {};

    if (isMobile) {
      containerClasses += " fixed";
      inlineStyle = {
        top: clickPosition.y,
        left: clickPosition.x,
        transform: "translate(-50%, -110%)",
      };
    } else {
      const isNearTop = alturaBarra > 85;

      containerClasses += isNearTop
        ? " absolute left-1/2 -translate-x-1/2 mt-2" // Posiciona abaixo do topo
        : " absolute left-1/2 -translate-x-1/2 -translate-y-[115%]"; // Posiciona acima (padrão)
    }
    return (
      <motion.div
        ref={isMobile ? popupRef : null}
        initial={{ opacity: 0, y: isMobile ? 0 : -5, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isMobile ? 0 : -5, scale: 0.9 }}
        className={containerClasses}
        style={inlineStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 mb-1 w-full justify-center">
          <span className="text-sm md:text-base">{item.icone || "💰"}</span>
          <p className="text-[11px] md:text-xs font-bold text-gray-700 truncate max-w-[85px] md:max-w-[100px] leading-tight">
            {nomeGasto}
          </p>
        </div>

        <p className="text-xs md:text-sm font-black text-brown-dark text-center leading-tight">
          R${" "}
          {item.valorItem.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>

        <p className="text-orange font-black text-xs md:text-sm mt-0.5">
          {percent}%
        </p>
        <div className="w-full h-[1px] bg-gray-100 my-1" />

        {periodo === "Dia" && (
          <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="w-full py-1 mb-1 text-[10px] md:text-xs text-white bg-orange font-bold rounded-md hover:bg-orange-dark active:scale-95 transition-all text-center cursor-pointer shadow-sm"
          >
            Editar Gasto
          </div>
        )}

        {periodo === "Dia" && (
          <p className="text-[9px] md:text-[10px] text-center text-gray-500 leading-none mb-1">
            Por: {item.autor || authorName}
          </p>
        )}

        {!item.isGroup && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id_financas);
            }}
            className="text-[9px] md:text-[10px] text-red-500 hover:underline font-bold uppercase cursor-pointer"
          >
            Excluir
          </span>
        )}
      </motion.div>
    );
  },
);

const BarChartItem = memo(
  ({
    item,
    index,
    isHovered,
    valorMaximo,
    totalGasto,
    setHoveredIndex,
    onClick,
    popupNode,
  }) => {
    let labelItem = item.labelItem || "";
    if (labelItem.length > 20) labelItem = labelItem.substring(0, 20) + "...";

    const alturaBarra =
      valorMaximo > 0 ? (item.valorItem / valorMaximo) * 100 : 0;

    return (
      <button
        type="button"
        className="relative w-8 sm:w-10 md:w-12 lg:w-16 h-full flex flex-col justify-end items-center group shrink-0 focus:outline-none rounded-t-sm z-20 hover:z-50 focus:z-50"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onFocus={() => setHoveredIndex(index)}
        onBlur={() => setHoveredIndex(null)}
        onClick={() => onClick(item)}
      >
        <motion.div
          className="relative w-full bg-gradient-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] cursor-pointer group-hover:brightness-110 rounded-t-sm shadow-md"
          initial={{ height: 0 }}
          animate={{ height: `${alturaBarra}%` }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        >
          <AnimatePresence>{isHovered && popupNode}</AnimatePresence>
        </motion.div>

        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] md:text-[12px] lg:text-[14px] font-bold text-[#5B3E31] text-center w-16 md:w-20 lg:w-24 break-words leading-tight">
          {labelItem}
        </span>
      </button>
    );
  },
);

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
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const mobilePopupRef = useRef(null);

  const [isMainMonthSelectorOpen, setIsMainMonthSelectorOpen] = useState(false);
  const [isMainYearSelectorOpen, setIsMainYearSelectorOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target)
      ) {
        setIsMainMonthSelectorOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setIsMainYearSelectorOpen(false);
      }
      if (activeMobileItem) {
        if (
          mobilePopupRef.current &&
          mobilePopupRef.current.contains(event.target)
        )
          return;
        setActiveMobileItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeMobileItem]);

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
    if (!meses.includes(mesHojeStr)) meses.push(mesHojeStr);
    return [...new Set(meses)].sort();
  }, [diasComGastos, mesHojeStr]);

  const anosDisponiveis = useMemo(() => {
    const anos = diasComGastos
      ? diasComGastos.map((data) => data.substring(0, 4))
      : [];
    const anoHojeStr = new Date().getFullYear().toString();
    if (!anos.includes(anoHojeStr)) anos.push(anoHojeStr);
    return [...new Set(anos)].sort((a, b) => b.localeCompare(a));
  }, [diasComGastos]);

  const obterTituloModal = () => {
    if (periodo === "Semana") return "Gastos por Dia";
    if (periodo === "Mês") return "Gastos por Semana";
    if (periodo === "Ano") return "Gastos por Mês";
    return "Detalhes dos Gastos";
  };

  const pieChartData = useMemo(() => {
    let cumulative = 0;
    return chartData.map((item, index) => {
      const slicePercent = totalGasto > 0 ? item.valorItem / totalGasto : 0;
      const percent =
        totalGasto > 0 ? ((item.valorItem / totalGasto) * 100).toFixed(1) : 0;

      let pathData = "";
      let textPos = { x: 0, y: 0 };

      if (slicePercent > 0 && slicePercent < 1) {
        const [startX, startY] = getCoordinatesForPercent(cumulative);
        const midPercent = cumulative + slicePercent / 2;
        textPos.x = Math.cos(2 * Math.PI * midPercent - Math.PI / 2) * 0.65;
        textPos.y = Math.sin(2 * Math.PI * midPercent - Math.PI / 2) * 0.65;

        cumulative += slicePercent;
        const [endX, endY] = getCoordinatesForPercent(cumulative);
        const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
        pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
      }

      return {
        ...item,
        slicePercent,
        percent,
        pathData,
        textPos,
        originalIndex: index,
      };
    });
  }, [chartData, totalGasto]);

  const handleEditGasto = useCallback(
    (item) => {
      const dadosFormatados = {
        ...item,
        valor: item.valorItem || item.valor || item.total,
        tipo:
          item.labelItem ||
          item.categoria ||
          item.nome_categoria ||
          item.tipo ||
          item.label,
        descricao: item.descricao || item.rawItem?.descricao || "",
        icone: item.icone || item.emoji,
        id_financas: item.id_financas,
      };
      setExpenseToEdit(dadosFormatados);
      setIsFormModalOpen(true);
      setActiveMobileItem(null);
    },
    [setExpenseToEdit, setIsFormModalOpen],
  );

  const handleExcluirGasto = useCallback(
    (id) => {
      handleDeleteExpense(id);
      setActiveMobileItem(null);
    },
    [handleDeleteExpense],
  );

  const renderPopup = useCallback(
    (item, percent, isMobile = false) => {
      const alturaBarra =
        valorMaximo > 0 ? (item.valorItem / valorMaximo) * 100 : 0;

      return (
        <ChartPopup
          item={item}
          percent={percent}
          isMobile={isMobile}
          clickPosition={clickPosition}
          popupRef={mobilePopupRef}
          periodo={periodo}
          authorName={authorName}
          onEdit={handleEditGasto}
          onDelete={handleExcluirGasto}
          alturaBarra={alturaBarra}
        />
      );
    },
    [
      clickPosition,
      periodo,
      authorName,
      handleEditGasto,
      handleExcluirGasto,
      valorMaximo,
    ],
  );

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="flex flex-col items-center justify-center py-4 md:py-8 lg:py-12 h-full px-2 md:px-4 lg:px-0">
        <LargeCard
          size="h-full sm:h-[80%] xl:h-[100%] 2xl:h-[87%] w-full md:w-10/12 lg:w-[65%] xl:w-[57%]"
          display="flex justify-center"
        >
          <div className="w-full h-full flex flex-col items-center bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-6  2xl:p-10 rounded-3xl relative custom-scrollbar lg:pb-10">
            <div className="flex flex-col items-center mb-4 md:mb-5 lg:mb-6 shrink-0">
              <span className="text-orange font-bold uppercase tracking-wider text-sm md:text-base lg:text-[18px] mb-1 text-center">
                Gastos do {periodo}
              </span>
              <h2 className="text-brown-dark font-extrabold text-2xl md:text-3xl lg:text-[40px] xl:text-[30px] 2xl:text-[40px]  text-center">
                R${" "}
                {totalGasto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="w-full flex items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-[50px] mt-2 md:mt-3 lg:mt-4 px-2 md:px-6 lg:px-10 xl:px-0 xl:mt-0 2xl:mt-4 2xl:px-10 shrink-0">
              {PERIODOS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex flex-col items-center cursor-pointer relative focus:outline-none group"
                  onClick={() => {
                    setPeriodo(item);
                    setIsMainMonthSelectorOpen(false);
                    setIsMainYearSelectorOpen(false);
                    setActiveMobileItem(null);
                  }}
                >
                  <span
                    className={`text-lg md:text-xl lg:text-2xl xl:text-[20px] 2xl:text-2xl pb-1 md:pb-2 transition-colors rounded-sm ${periodo === item ? "text-orange font-bold" : "text-orange font-medium"}`}
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
                </button>
              ))}
            </div>

            <div className="text-orange font-semibold mt-4 md:mt-5 lg:mt-6 mb-4 md:mb-5 text-sm md:text-base lg:text-xl xl:text-[15px] xl:mt-2 xl:mb-2 2xl:mb-4 2xl:mt-6 2xl:text-xl relative flex justify-center w-full z-30 shrink-0">
              {periodo === "Dia" || periodo === "Semana" ? (
                <button
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex items-center gap-2 px-4 md:px-5 xl:py-1 2xl:px-2.5 py-2 md:py-2.5 bg-orange-50 border border-orange/30 rounded-full hover:bg-orange hover:text-white transition-all shadow-sm active:scale-95 group focus:outline-none"
                >
                  <span>{labelsData[periodo]}</span>
                  <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">
                    📅
                  </span>
                </button>
              ) : periodo === "Mês" ? (
                <div
                  className="relative w-52 md:w-60 lg:w-64 bg-white rounded-2xl shadow-md border border-gray-100"
                  ref={monthDropdownRef}
                >
                  <button
                    type="button"
                    className="w-full relative p-2 md:p-3 px-4 md:px-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors focus:outline-none"
                    onClick={() =>
                      setIsMainMonthSelectorOpen(!isMainMonthSelectorOpen)
                    }
                  >
                    <div className="flex items-center gap-1">
                      <h3 className="text-[#4a2511] font-bold text-sm md:text-base">
                        Mês:
                      </h3>
                      <span className="text-orange font-semibold text-sm md:text-base capitalize">
                        {mesesNomes[mesAtualIndex]} {anoAtual}
                      </span>
                    </div>
                    <motion.img
                      src={chevronDownBrownIcon}
                      alt=""
                      animate={{ rotate: isMainMonthSelectorOpen ? 180 : 0 }}
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                  </button>
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
                              <button
                                key={mDisponivel}
                                type="button"
                                className="flex items-center w-full gap-2 cursor-pointer p-2 hover:bg-orange-50 rounded-xl transition-colors focus:outline-none"
                                onClick={() => {
                                  const novaData = new Date(
                                    parseInt(y, 10),
                                    parseInt(m, 10) - 1,
                                    1,
                                  );
                                  if (onSelectDate) onSelectDate(novaData);
                                  else if (handleDayClick)
                                    handleDayClick({ exactDate: novaData });
                                  setPeriodo("Mês");
                                  setIsMainMonthSelectorOpen(false);
                                }}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-orange" : "border-[#4a2511]/30"}`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 bg-orange rounded-full" />
                                  )}
                                </div>
                                <span
                                  className={`text-xs md:text-sm capitalize ${isSelected ? "text-orange font-bold" : "text-[#4a2511] font-medium"}`}
                                >
                                  {mesesNomes[parseInt(m, 10) - 1]} {y}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div
                  className="relative w-52 md:w-60 lg:w-64 bg-white rounded-2xl shadow-md border border-gray-100"
                  ref={yearDropdownRef}
                >
                  <button
                    type="button"
                    className="w-full relative p-2 md:p-3 px-4 md:px-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors focus:outline-none"
                    onClick={() =>
                      setIsMainYearSelectorOpen(!isMainYearSelectorOpen)
                    }
                  >
                    <div className="flex items-center gap-1">
                      <h3 className="text-[#4a2511] font-bold text-sm md:text-base">
                        Ano:
                      </h3>
                      <span className="text-orange font-semibold text-sm md:text-base">
                        {anoAtual}
                      </span>
                    </div>
                    <motion.img
                      src={chevronDownBrownIcon}
                      alt=""
                      animate={{ rotate: isMainYearSelectorOpen ? 180 : 0 }}
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                  </button>
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
                              <button
                                key={ano}
                                type="button"
                                className="flex items-center w-full gap-2 cursor-pointer p-2  hover:bg-orange-50 rounded-xl transition-colors focus:outline-none"
                                onClick={() => {
                                  const novaData = new Date(
                                    parseInt(ano, 10),
                                    0,
                                    1,
                                  );
                                  if (onSelectDate) onSelectDate(novaData);
                                  else if (handleDayClick)
                                    handleDayClick({ exactDate: novaData });
                                  setPeriodo("Ano");
                                  setIsMainYearSelectorOpen(false);
                                }}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-orange" : "border-[#4a2511]/30"}`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 bg-orange rounded-full" />
                                  )}
                                </div>
                                <span
                                  className={`text-xs md:text-sm ${isSelected ? "text-orange font-bold" : "text-[#4a2511] font-medium"}`}
                                >
                                  {ano}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* CONTAINER DOS GRÁFICOS */}
            <div
              className={`flex flex-col w-full max-w-[900px] items-center relative shrink-0 ${activeMobileItem ? "z-[999]" : "z-10"}`}
            >
              {/* TABLET / DESKTOP VIEW */}
              <div className="hidden md:flex flex-col w-full">
                {isScrollable && (
                  <div
                    ref={topScrollRef}
                    onScroll={(e) => {
                      if (chartScrollRef.current)
                        chartScrollRef.current.scrollLeft =
                          e.currentTarget.scrollLeft;
                    }}
                    className="w-full pl-12 md:pl-14 overflow-x-auto custom-scrollbar  [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md mb-2"
                  >
                    <div className="flex justify-start gap-10 md:gap-12 lg:gap-16 pr-8 h-px">
                      {chartData.map((item) => (
                        <div
                          key={`dummy-${item.id_financas}`}
                          className="w-10 md:w-12 lg:w-16 shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative w-full h-[200px] md:h-[220px] lg:h-[240px] 2xl:h-[370px] flex">
                  <div className="w-12 md:w-14 h-full flex flex-col justify-between pb-12 z-0 border-r border-gray-300">
                    {yAxisValues.map((val, i) => (
                      <span
                        key={`y-${i}`}
                        className="text-[11px] md:text-xs lg:text-[14px] text-gray-800 font-medium text-right pr-2 md:pr-3"
                      >
                        {val}
                      </span>
                    ))}
                  </div>

                  <div className="absolute top-0 right-0 left-12 md:left-14 bottom-12 flex flex-col justify-between pointer-events-none z-0">
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
                      if (topScrollRef.current)
                        topScrollRef.current.scrollLeft =
                          e.currentTarget.scrollLeft;
                    }}
                    className={`flex-1 h-full overflow-x-auto overflow-y-visible flex items-end pb-12 z-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isScrollable ? "justify-start gap-8 md:gap-12 lg:gap-16 pr-8 pl-4" : "justify-evenly gap-3 md:gap-4 lg:gap-6"}`}
                  >
                    {chartData.map((item, index) => {
                      const percent =
                        totalGasto > 0
                          ? ((item.valorItem / totalGasto) * 100).toFixed(1)
                          : 0;
                      return (
                        <BarChartItem
                          key={item.id_financas}
                          item={item}
                          index={index}
                          isHovered={hoveredIndex === index}
                          valorMaximo={valorMaximo}
                          totalGasto={totalGasto}
                          setHoveredIndex={setHoveredIndex}
                          onClick={handleBarClick}
                          popupNode={renderPopup(item, percent, false)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MOBILE VIEW (Gráfico de Pizza) */}
              <div className="flex md:hidden flex-col items-center w-full h-[205px] sm:h-[280px] shrink-0 relative">
                {chartData.length > 0 ? (
                  <>
                    <svg
                      viewBox="-1.2 -1.2 2.4 2.4"
                      className="w-full h-full z-10"
                    >
                      {pieChartData.map((pData) => {
                        if (pData.slicePercent === 0) return null;

                        const labelItemStr =
                          pData.labelItem ||
                          pData.descricao ||
                          pData.description ||
                          "Gasto";
                        const handleSliceAction = (e) => {
                          e.stopPropagation();
                          setClickPosition({ x: e.clientX, y: e.clientY });
                          setActiveMobileItem(pData);
                        };

                        if (pData.slicePercent === 1) {
                          return (
                            <g key={`pie-${pData.id_financas}`}>
                              <circle
                                cx="0"
                                cy="0"
                                r="1"
                                fill={
                                  PIE_COLORS[
                                    pData.originalIndex % PIE_COLORS.length
                                  ]
                                }
                                className="cursor-pointer outline-none transition-opacity hover:opacity-80 active:opacity-60"
                                onClick={handleSliceAction}
                              />
                              <text
                                x="0"
                                y="0"
                                fontSize="0.14"
                                fill="#662700"
                                className="pointer-events-none font-black tracking-wider fill-brown-dark"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {periodo === "Dia" ? (
                                  <>
                                    <tspan x="0" dy="-0.06">
                                      {labelItemStr.substring(0, 14)}
                                    </tspan>
                                    <tspan x="0" dy="0.14">
                                      {pData.percent}%
                                    </tspan>
                                  </>
                                ) : (
                                  <tspan x="0">{pData.percent}%</tspan>
                                )}
                              </text>
                            </g>
                          );
                        }

                        const apenasPorcentagem =
                          pData.slicePercent < 0.15 || periodo !== "Dia";

                        return (
                          <g key={`pie-${pData.id_financas}`}>
                            <path
                              d={pData.pathData}
                              fill={
                                PIE_COLORS[
                                  pData.originalIndex % PIE_COLORS.length
                                ]
                              }
                              className="cursor-pointer outline-none transition-opacity hover:opacity-80 active:opacity-60"
                              onClick={handleSliceAction}
                            />
                            {pData.slicePercent > 0.04 && (
                              <text
                                x={pData.textPos.x}
                                y={pData.textPos.y}
                                fontSize="0.11"
                                fill="#662700"
                                className="pointer-events-none font-extrabold fill-brown-dark"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {apenasPorcentagem ? (
                                  <tspan x={pData.textPos.x}>
                                    {pData.percent}%
                                  </tspan>
                                ) : (
                                  <>
                                    <tspan x={pData.textPos.x} dy="-0.05">
                                      {labelItemStr.substring(0, 10)}
                                    </tspan>
                                    <tspan x={pData.textPos.x} dy="0.12">
                                      {pData.percent}%
                                    </tspan>
                                  </>
                                )}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    <AnimatePresence>
                      {activeMobileItem &&
                        renderPopup(
                          activeMobileItem,
                          activeMobileItem.percent,
                          true,
                        )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 font-semibold text-sm">
                    Nenhum dado disponível.
                  </div>
                )}
              </div>
            </div>

            {/* Botões do Rodapé */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 lg:gap-10 mt-auto md:pt-8 xl:pt-0 z-10 w-full shrink-0">
              {periodo !== "Ano" && (
                <DefaultButton
                  text="Editar"
                  another_size="h-10 w-32 md:h-12 md:w-36 lg:h-14 lg:w-40 text-sm md:text-base"
                  onClick={handleOpenFullList}
                  theme={false}
                />
              )}
              <DefaultButton
                text="Incluir"
                another_size="h-10 w-32 md:h-12 md:w-36 lg:h-14 lg:w-40 text-sm md:text-base"
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
