import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import AddExpenses from "../components/ui/AddExpenses";
import { editIcon } from "../assets";
import FinancialSelect from "../components/ui/FinancialSelect";

function FinancierScreen() {
  const [periodo, setPeriodo] = useState("Mês");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoVisualizacao, setTipoVisualizacao] = useState("total");

  const [dadosPorPeriodo, setDadosPorPeriodo] = useState(() => {
    const saved = localStorage.getItem("@FamilySync:gastos");
    return saved
      ? JSON.parse(saved)
      : { Dia: [], Semana: [], Mês: [], Ano: [] };
  });

  const gastosAtuais = dadosPorPeriodo[periodo] || [];
  const totalGastoNoPeriodo = gastosAtuais.reduce(
    (acc, curr) => acc + curr.valor,
    0,
  );

  const valorMaximoReal =
    gastosAtuais.length > 0
      ? Math.max(...gastosAtuais.map((item) => item.valor))
      : 1000;

  const maiorGastoNoPeriodo = valorMaximoReal;

  const handleDeleteExpense = (id) => {
    const novosDados = { ...dadosPorPeriodo };
    Object.keys(novosDados).forEach((p) => {
      novosDados[p] = novosDados[p].filter((item) => item.id !== id);
    });
    setDadosPorPeriodo(novosDados);
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(novosDados));
  };

  const handleSaveExpense = (categoria, valor, emoji) => {
    const novosDados = { ...dadosPorPeriodo };
    const periodos = ["Dia", "Semana", "Mês", "Ano"];

    periodos.forEach((p) => {
      const itemExistente = novosDados[p].find(
        (item) => item.label === categoria,
      );

      if (itemExistente) {
        novosDados[p] = novosDados[p].map((item) =>
          item.label === categoria
            ? { ...item, valor: item.valor + valor }
            : item,
        );
      } else {
        novosDados[p] = [
          ...novosDados[p],
          { label: categoria, valor: valor, emoji: emoji, id: Date.now() },
        ];
      }
    });

    setDadosPorPeriodo(novosDados);
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(novosDados));
    setIsModalOpen(false);
  };

  const gerarEixoY = () => {
    const passos = 5;
    const valores = [];
    for (let i = passos; i >= 0; i--) {
      valores.push(Math.round((maiorGastoNoPeriodo / passos) * i));
    }
    return valores;
  };

  const yAxisValues = gerarEixoY();

  const labelsData = useMemo(() => {
    const hoje = new Date();
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const formataDiaMesCurto = (data) =>
      data
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "");

    const diaFormatado = hoje.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });

    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay());
    const sabado = new Date(hoje);
    sabado.setDate(hoje.getDate() + (6 - hoje.getDay()));
    const semanaFormatada = `${formataDiaMesCurto(domingo)} - ${formataDiaMesCurto(sabado)}`;

    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const mesFormatado = `${formataDiaMesCurto(primeiroDiaMes)} - ${formataDiaMesCurto(ultimoDiaMes)}`;
    const anoFormatado = `Janeiro - Dezembro ${hoje.getFullYear()}`;

    return {
      Dia: capitalize(diaFormatado),
      Semana: semanaFormatada,
      Mês: mesFormatado,
      Ano: anoFormatado,
    };
  }, []);

  const opcoesVisualizacao = ["total", "dia", "semana", "mês", "ano"];

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <LargeCard
          color={"bg-black/20 backdrop-blur-md"}
          size={"h-[85%] w-[65%]"}
          display={"flex justify-center"}
        >
          <div className="w-full h-full flex flex-col items-center bg-white p-10 rounded-3xl relative">
            {/* Header: Select e Valor Total */}
            <div className="flex flex-col items-center mb-6">
              <FinancialSelect
                value={tipoVisualizacao}
                onChange={setTipoVisualizacao}
                options={opcoesVisualizacao}
              />
              <div className="flex items-center gap-3">
                <h2 className="text-brown-dark font-extrabold text-[40px]">
                  R$ {totalGastoNoPeriodo.toLocaleString("pt-BR")}
                </h2>
              </div>
            </div>

            {/* Tabs de Período */}
            <div className="w-full flex items-center justify-center gap-50 mt-4 px-10">
              {["Dia", "Semana", "Mês", "Ano"].map((item) => (
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
                      initial={false}
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

            {/* Label de Data */}
            <div className="text-orange font-semibold mt-6 mb-8 text-xl">
              {labelsData[periodo]}
            </div>

            {/* Container do Gráfico */}
            <div className="relative w-full max-w-300 h-150 mt-2 mb-10">
              {/* Eixo Y e Linhas de Grade */}
              <div className="absolute inset-0 flex flex-col justify-between z-0">
                {yAxisValues.map((val, i) => (
                  <div key={i} className="flex items-center w-full h-0">
                    <span className="text-[16px] text-gray-800 font-medium w-12 text-right pr-3 bg-white z-10">
                      {val}
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="w-2 border-t border-gray-300 border-r h-full"></div>
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 left-12 border-l border-gray-300"></div>
              </div>

              {/* Área das Barras */}
              <div className="relative z-10 w-full h-full flex items-end justify-around pl-15 pr-4">
                {gastosAtuais.map((item, index) => {
                  const alturaDaBarra =
                    maiorGastoNoPeriodo > 0
                      ? (item.valor / maiorGastoNoPeriodo) * 100
                      : 0;
                  const porcentagemTotal =
                    totalGastoNoPeriodo > 0
                      ? ((item.valor / totalGastoNoPeriodo) * 100).toFixed(1)
                      : 0;

                  const savedUser = localStorage.getItem("@FamilySync:user");
                  const parsedUser = savedUser ? JSON.parse(savedUser) : {};
                  const authorName = parsedUser.nome || "Usuário";

                  return (
                    <div
                      key={item.id}
                      className="relative w-14 h-full flex flex-col justify-end items-center group"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full -mt-60 z-30 w-52 bg-white border border-orange-200 shadow-2xl rounded-2xl p-4 flex flex-col items-center origin-top"
                          >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-orange-200 rotate-45"></div>

                            <span className="text-4xl mb-2">
                              {item.emoji || "💰"}
                            </span>

                            <div className="flex items-center justify-center gap-2 mb-1 w-full">
                              <p className="text-xl font-black text-brown-dark">
                                R$ {item.valor.toLocaleString("pt-BR")}
                              </p>
                            </div>

                            <p className="text-[11px] text-gray-400 font-bold uppercase">
                              Adicionado por:
                            </p>
                            <p className="text-sm font-bold text-brown-dark mb-2">
                              {authorName}
                            </p>

                            <div className="w-full h-px bg-gray-100 my-1"></div>

                            <p className="text-[#E77838] font-black text-lg">
                              {porcentagemTotal}%
                            </p>

                            <button
                              onClick={() => handleDeleteExpense(item.id)}
                              className="mt-2 text-[12px] text-red-500 hover:underline font-bold uppercase"
                            >
                              Excluir Gasto
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Barra do Gráfico */}
                      <motion.div
                        className="w-full bg-linear-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] cursor-pointer hover:brightness-110 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${alturaDaBarra}%` }}
                        transition={{
                          duration: 0.6,
                          type: "spring",
                          bounce: 0.3,
                        }}
                      />

                      <span className="absolute top-full mt-1 text-base font-bold text-[#5B3E31] leading-[1.1] w-24 left-1/2 -translate-x-1/2 text-center break-words">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-8 flex w-full justify-center">
              <DefaultButton
                text="Incluir"
                another_size={"h-14 w-14"}
                another_padding={"px-18"}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </LargeCard>

        {isModalOpen && (
          <AddExpenses
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveExpense}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
