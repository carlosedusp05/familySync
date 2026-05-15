import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import AddExpenses from "../components/ui/AddExpenses";
import FinancialSelect from "../components/ui/FinancialSelect";
import EditExpensesList from "../components/ui/EditExpensesList";
const PERIODOS = ["Dia", "Semana", "Mês", "Ano"];
const OPCOES_VISUALIZACAO = ["total", "dia", "semana", "mês", "ano"];

function FinancierScreen() {
  const [periodo, setPeriodo] = useState("Mês");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoVisualizacao, setTipoVisualizacao] = useState("total");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [dadosPorPeriodo, setDadosPorPeriodo] = useState(() => {
    const saved = localStorage.getItem("@FamilySync:gastos");
    return saved
      ? JSON.parse(saved)
      : { Dia: [], Semana: [], Mês: [], Ano: [] };
  });

  const authorName = useMemo(() => {
    const savedUser = localStorage.getItem("@FamilySync:user");
    return savedUser ? JSON.parse(savedUser).nome : "Usuário";
  }, []);
  useEffect(() => {
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(dadosPorPeriodo));
  }, [dadosPorPeriodo]);

  const gastosAtuais = dadosPorPeriodo[periodo] || [];

  const { totalGasto, valorMaximo } = useMemo(() => {
    const total = gastosAtuais.reduce((acc, curr) => acc + curr.valor, 0);
    const max =
      gastosAtuais.length > 0
        ? Math.max(...gastosAtuais.map((item) => item.valor))
        : 1000;
    return { totalGasto: total, valorMaximo: max };
  }, [gastosAtuais]);

  const yAxisValues = useMemo(() => {
    const passos = 5;
    return Array.from({ length: passos + 1 }, (_, i) =>
      Math.round((valorMaximo / passos) * (passos - i)),
    );
  }, [valorMaximo]);

  const labelsData = useMemo(() => {
    const hoje = new Date();
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const fmt = (d) =>
      d
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "");

    const dom = new Date(hoje);
    dom.setDate(hoje.getDate() - hoje.getDay());
    const sab = new Date(hoje);
    sab.setDate(hoje.getDate() + (6 - hoje.getDay()));
    const pMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const uMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    return {
      Dia: capitalize(
        hoje.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
      ),
      Semana: `${fmt(dom)} - ${fmt(sab)}`,
      Mês: `${fmt(pMes)} - ${fmt(uMes)}`,
      Ano: `Janeiro - Dezembro ${hoje.getFullYear()}`,
    };
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    setDadosPorPeriodo((prev) => {
      const novosDados = { ...prev };
      PERIODOS.forEach((p) => {
        novosDados[p] = novosDados[p].filter((item) => item.id !== id);
      });
      return novosDados;
    });
  }, []);

  const handleSaveExpense = useCallback((categoria, valor, emoji, idToEdit) => {
    setDadosPorPeriodo((prev) => {
      const novosDados = { ...prev };

      PERIODOS.forEach((p) => {
        if (idToEdit) {
          const index = novosDados[p].findIndex((item) => item.id === idToEdit);
          if (index !== -1) {
            novosDados[p][index] = {
              ...novosDados[p][index],
              label: categoria,
              valor,
              emoji,
            };
          }
        } else {
          const novoId = Date.now();
          const index = novosDados[p].findIndex(
            (item) => item.label === categoria,
          );
          if (index !== -1) {
            novosDados[p][index].valor += valor;
          } else {
            novosDados[p] = [
              ...novosDados[p],
              { label: categoria, valor, emoji, id: novoId },
            ];
          }
        }
      });
      return novosDados;
    });
    setIsFormModalOpen(false);
    setExpenseToEdit(null);
  }, []);

  const handleOpenEditForm = (item) => {
    setExpenseToEdit(item);
    setIsFormModalOpen(true);
    setIsListModalOpen(false);
  };

  const handleOpenAddForm = () => {
    setExpenseToEdit(null);
    setIsFormModalOpen(true);
    setIsListModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <LargeCard size="h-[85%] w-[65%]" display="flex justify-center">
          <div className="w-full h-full flex flex-col items-center bg-white p-10 rounded-3xl relative">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <FinancialSelect
                value={tipoVisualizacao}
                onChange={setTipoVisualizacao}
                options={OPCOES_VISUALIZACAO}
              />
              <h2 className="text-brown-dark font-extrabold text-[40px]">
                R$ {totalGasto.toLocaleString("pt-BR")}
              </h2>
            </div>

            {/* Tabs */}
            <div className="w-full flex items-center justify-center gap-50 mt-4 px-10">
              {PERIODOS.map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center cursor-pointer relative"
                  onClick={() => setPeriodo(item)}
                >
                  <span
                    className={`text-2xl pb-2 transition-colors ${periodo === item ? "text-orange font-bold" : "text-orange font-medium"}`}
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

            <div className="text-orange font-semibold mt-6 mb-8 text-xl">
              {labelsData[periodo]}
            </div>

            {/* Gráfico */}
            <div className="relative w-full max-w-300 h-150 mt-2 mb-10">
              {/* Eixo Y */}
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

              {/* Barras */}
              <div className="relative z-10 w-full h-full flex items-end justify-around pl-15 pr-4">
                {gastosAtuais.map((item, index) => {
                  const alturaBarra =
                    valorMaximo > 0 ? (item.valor / valorMaximo) * 100 : 0;
                  const percent =
                    totalGasto > 0
                      ? ((item.valor / totalGasto) * 100).toFixed(1)
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="relative w-14 h-full flex flex-col justify-end items-center group"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleOpenEditForm(item)}
                    >
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full -mt-60 z-30 w-52 bg-white border border-orange-200 shadow-2xl rounded-2xl p-4 flex flex-col items-center"
                          >
                            <span className="text-4xl mb-2">
                              {item.emoji || "💰"}
                            </span>
                            <p className="text-xl font-black text-brown-dark">
                              R$ {item.valor.toLocaleString("pt-BR")}
                            </p>
                            <p className="text-[11px] text-gray-400 font-bold uppercase">
                              Adicionado por:
                            </p>
                            <p>{authorName}</p>
                            <div className="w-full h-px bg-gray-100 my-2" />
                            <p className="text-orange font-black text-lg">
                              {percent}%
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteExpense(item.id);
                              }}
                              className="mt-2 text-[12px] text-red-500 hover:underline font-bold uppercase"
                            >
                              Excluir
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className="w-full bg-linear-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] cursor-pointer hover:brightness-110 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${alturaBarra}%` }}
                        transition={{
                          duration: 0.6,
                          type: "spring",
                          bounce: 0.3,
                        }}
                      />
                      <span className="absolute top-full mt-1 text-base font-bold text-[#5B3E31] w-24 text-center wrap-break-word">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-40">
              <DefaultButton
                text="Editar"
                another_size="h-14 w-30"
                onClick={() => setIsListModalOpen(true)}
                theme={false}
              />
              <DefaultButton
                text="Incluir"
                another_size="h-14 w-30"
                onClick={handleOpenAddForm}
              />
            </div>
          </div>
        </LargeCard>

        <AnimatePresence>
          {isListModalOpen && (
            <EditExpensesList
              expenses={gastosAtuais}
              totalGasto={totalGasto}
              onClose={() => setIsListModalOpen(false)}
              onEdit={handleOpenEditForm}
              onDelete={handleDeleteExpense}
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

export default FinancierScreen;
