import { useState } from "react";
import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import AddExpenses from "../components/ui/AddExpenses";
import { editIcon, dollarIcon, sortDownIcon } from "../assets";

function FinancierScreen() {
  const [periodo, setPeriodo] = useState("Mês");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const maiorGastoNoPeriodo = valorMaximoReal * 1.2;

  const handleDeleteExpense = (id) => {
    const novosDados = { ...dadosPorPeriodo };
    Object.keys(novosDados).forEach((p) => {
      novosDados[p] = novosDados[p].filter((item) => item.id !== id);
    });
    setDadosPorPeriodo(novosDados);
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(novosDados));
  };

  const [salario, setSalario] = useState(() => {
    const saved = localStorage.getItem("@FamilySync:salario");
    return saved ? Number(saved) : 5000;
  });

  const handleUpdateSalario = (novoSalario) => {
    setSalario(novoSalario);
    localStorage.setItem("@FamilySync:salario", novoSalario.toString());
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

  const labelsData = {
    Dia: "08 de Maio",
    Semana: "04 Mai - 10 Mai",
    Mês: "01 mar - 31 mar",
    Ano: "Janeiro - Dezembro 2026",
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <LargeCard size={"h-[85%] w-[65%]"} display={"flex justify-center"}>
          <div className="w-full h-full flex flex-col items-center bg-white p-10 rounded-3xl relative">
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 text-orange font-bold mb-1">
                <img src={dollarIcon} alt="Moeda" className="w-4 h-4" />
                <span className="text-2xl">Total</span>
                <img src={sortDownIcon} alt="Seta" className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-brown-dark font-extrabold text-[40px]">
                  R$ {totalGastoNoPeriodo.toLocaleString("pt-BR")}
                </h2>
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-50 mt-4 px-10">
              {["Dia", "Semana", "Mês", "Ano"].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center cursor-pointer relative"
                  onClick={() => setPeriodo(item)}
                >
                  <span
                    className={`text-2xl pb-2 transition-colors ${periodo === item ? "text-[#E77838] font-semibold" : "text-[#E77838]/60 font-medium"}`}
                  >
                    {item}
                  </span>
                  {periodo === item && (
                    <div className="absolute bottom-0 h-[2px] w-full bg-[#E77838]"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-orange font-semibold mt-6 mb-8 text-xl">
              {labelsData[periodo]}
            </div>

            <div className="relative w-full max-w-300 h-150 mt-2 mb-10">
              <div className="absolute inset-0 flex flex-col justify-between z-0">
                {yAxisValues.map((val, i) => (
                  <div key={i} className="flex items-center w-full h-0">
                    <span className="text-[16px] text-gray-800 font-medium w-12 text-right pr-3 bg-white z-10">
                      {val}
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="w-2 border-t border-gray-300 border-r h-full"></div>{" "}
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 left-[48px] border-l border-gray-300"></div>
              </div>

              <div className="relative z-10 w-full h-full flex items-end justify-around pl-[60px] pr-4">
                {gastosAtuais.map((item, index) => {
                  const alturaDaBarra =
                    maiorGastoNoPeriodo > 0
                      ? (item.valor / maiorGastoNoPeriodo) * 100
                      : 0;
                  const porcentagemTotal =
                    totalGastoNoPeriodo > 0
                      ? ((item.valor / totalGastoNoPeriodo) * 100).toFixed(1)
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="relative w-14 h-full flex flex-col justify-end items-center group"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`absolute bottom-[${alturaDaBarra}%] mb-4 z-30 w-48 bg-white border border-orange-200 shadow-xl rounded-2xl p-4 flex flex-col items-center transition-all duration-300 origin-bottom
                        ${hoveredIndex === index ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"}`}
                      >
                        <span className="text-3xl mb-1">
                          {item.emoji || "💰"}
                        </span>
                        <p className="text-xs text-gray-400 font-medium">
                          Adicionado por:
                        </p>
                        <p className="text-sm font-bold text-brown-dark">
                          {item.author || "Usuário"}
                        </p>
                        <div className="w-full h-px bg-gray-100 my-2"></div>
                        <p className="text-[#E77838] font-black text-lg">
                          {porcentagemTotal}%
                        </p>

                        <button
                          onClick={() => handleDeleteExpense(item.id)}
                          className="mt-2 text-[10px] text-red-500 hover:underline font-bold uppercase tracking-wider"
                        >
                          Excluir Gasto
                        </button>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-orange-200 rotate-45"></div>
                      </div>

                      <div
                        className="w-full bg-linear-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] transition-all duration-500 hover:brightness-110 cursor-pointer"
                        style={{ height: `${alturaDaBarra}%` }}
                      ></div>
                      <span className="absolute -bottom-6 text-sm font-medium text-gray-700 truncate w-full text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex px-165 w-full justify-center">
              <DefaultButton
                text="Incluir"
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
