import { useState } from "react";
import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import { editIcon, dollarIcon, sortDownIcon } from "../assets";

function FinancierScreen() {
  const [salario, setSalario] = useState(5000);
  const [periodo, setPeriodo] = useState("Mês");

  const [editandoSalario, setEditandoSalario] = useState(false);
  const [tempSalario, setTempSalario] = useState(salario);

  const getSalarioContextualizado = () => {
    switch (periodo) {
      case "Dia":
        return Math.round(salario / 30 / 24);
      case "Semana":
        return Math.round(salario / 4);
      case "Ano":
        return salario * 12;
      case "Mês":
      default:
        return salario;
    }
  };

  const salarioAtualPeriodo = getSalarioContextualizado();

  const gerarEixoY = () => {
    const passos = 7;
    const valores = [];
    for (let i = passos; i >= 0; i--) {
      valores.push(Math.round((salarioAtualPeriodo / passos) * i));
    }
    return valores;
  };

  const yAxisValues = gerarEixoY();

  const dadosPorPeriodo = {
    Dia: [
      { label: "Mercado", porcentagem: 10 },
      { label: "Transp.", porcentagem: 24 },
      { label: "Lazer", porcentagem: 70 },
      { label: "Saúde", porcentagem: 40 },
      { label: "Contas", porcentagem: 20 },
      { label: "Roupas", porcentagem: 0 },
      { label: "Escola", porcentagem: 0 },
      { label: "Impostos", porcentagem: 0 },
      { label: "Viagens", porcentagem: 0 },
      { label: "Casa", porcentagem: 0 },
      { label: "Carro", porcentagem: 0 },
      { label: "Outros", porcentagem: 0 },
    ],
    Semana: [
      { label: "Mercado", porcentagem: 20 },
      { label: "Transp.", porcentagem: 30 },
      { label: "Lazer", porcentagem: 90 },
      { label: "Saúde", porcentagem: 16 },
      { label: "Contas", porcentagem: 60 },
      { label: "Roupas", porcentagem: 76 },
      { label: "Escola", porcentagem: 0 },
      { label: "Impostos", porcentagem: 0 },
      { label: "Viagens", porcentagem: 0 },
      { label: "Casa", porcentagem: 0 },
      { label: "Carro", porcentagem: 0 },
      { label: "Outros", porcentagem: 10 },
    ],
    Mês: [
      { label: "Mercado", porcentagem: 64 },
      { label: "Transp.", porcentagem: 42 },
      { label: "Lazer", porcentagem: 96 },
      { label: "Saúde", porcentagem: 0 },
      { label: "Contas", porcentagem: 0 },
      { label: "Roupas", porcentagem: 0 },
      { label: "Escola", porcentagem: 0 },
      { label: "Impostos", porcentagem: 0 },
      { label: "Viagens", porcentagem: 0 },
      { label: "Casa", porcentagem: 30 },
      { label: "Carro", porcentagem: 0 },
      { label: "Outros", porcentagem: 0 },
    ],
    Ano: [
      { label: "Mercado", porcentagem: 40 },
      { label: "Transp.", porcentagem: 50 },
      { label: "Lazer", porcentagem: 80 },
      { label: "Saúde", porcentagem: 64 },
      { label: "Contas", porcentagem: 96 },
      { label: "Roupas", porcentagem: 42 },
      { label: "Escola", porcentagem: 30 },
      { label: "Impostos", porcentagem: 56 },
      { label: "Viagens", porcentagem: 78 },
      { label: "Casa", porcentagem: 62 },
      { label: "Carro", porcentagem: 40 },
      { label: "Outros", porcentagem: 99 },
    ],
  };

  const labelsData = {
    Dia: "08 de Maio",
    Semana: "04 Mai - 10 Mai",
    Mês: "Maio 2026",
    Ano: "Janeiro - Dezembro 2026",
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-12 h-full">
        <LargeCard size={"h-[85%] w-[60%]"} display={"flex justify-center"}>
          <div className="w-full min-h-20 flex flex-col justify-center items-center bg-white px-10 rounded-2xl shadow-inner relative">
            <div className="flex items-center gap-2">
              <img src={dollarIcon} alt="Dinheiro" className="w-6 h-6" />
              <span className="text-brown-dark font-bold text-2xl tracking-wide">
                Total
              </span>
              <img
                src={sortDownIcon}
                alt="Expandir"
                className="w-4 h-4 opacity-70"
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              {editandoSalario ? (
                <input
                  type="number"
                  autoFocus
                  className="text-orange-500 font-bold text-3xl w-40 border-b-2 border-orange-500 outline-none"
                  value={tempSalario}
                  onChange={(e) => setTempSalario(Number(e.target.value))}
                  onBlur={() => {
                    setSalario(tempSalario);
                    setEditandoSalario(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSalario(tempSalario);
                      setEditandoSalario(false);
                    }
                  }}
                />
              ) : (
                <h2 className="text-orange-500 font-bold text-3xl">
                  R$ {salario.toLocaleString()}
                </h2>
              )}
              <button
                className="p-1 active:scale-95 transition-transform"
                onClick={() => {
                  setTempSalario(salario);
                  setEditandoSalario(true);
                }}
              >
                <img
                  src={editIcon}
                  alt="Editar"
                  className="w-6 h-6"
                  draggable={false}
                />
              </button>
            </div>

            <div className="w-full flex items-center justify-between px-20 mt-8">
              {["Dia", "Semana", "Mês", "Ano"].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setPeriodo(item)}
                >
                  <span
                    className={`text-2xl transition-colors ${
                      periodo === item
                        ? "text-orange-500 font-bold"
                        : "text-orange-400 font-medium group-hover:text-orange-500"
                    }`}
                  >
                    {item}
                  </span>
                  {periodo === item && (
                    <div className="h-1 w-full bg-orange-500 mt-1 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-orange-500 font-semibold my-6 text-xl">
              {labelsData[periodo]}
            </div>

            <div className="relative w-[85%] h-[45%] mt-4 flex">
              <div className="relative w-16 h-full flex flex-col justify-between items-end pr-4 text-gray-400 font-medium text-lg">
                {yAxisValues.map((val, idx) => (
                  <span key={idx} className="leading-none">
                    {val}
                  </span>
                ))}
              </div>

              <div className="relative flex-1 border-l border-b border-gray-300 h-full">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="absolute inset-0 grid grid-cols-6 divide-x divide-gray-100">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-full"></div>
                    ))}
                    <div className="h-full border-r border-gray-100"></div>
                  </div>

                  {yAxisValues.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-full border-t border-gray-100 relative z-0"
                    ></div>
                  ))}
                </div>
                <div className="relative w-full h-full flex justify-around items-start px-2">
                  {dadosPorPeriodo[periodo].map((item, index) => (
                    <div
                      key={index}
                      className="relative z-10 flex flex-col items-center"
                      style={{
                        width: periodo === "Ano" ? "6%" : "12%",
                        height: "100%",
                      }}
                    >
                      <div className="flex items-end h-full w-full">
                        <div
                          className="w-full bg-linear-to-b from-[#FFB382] via-[#FF8C42] to-[#DFB3CD] rounded-b-sm shadow-sm transition-all duration-700"
                          style={{ height: `${item.porcentagem}%` }}
                        ></div>
                      </div>

                      <span className="absolute -bottom-10 text-xl text-gray-500 font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center gap-70 mt-25 mb-4">
              <DefaultButton text="Editar" another_size="h-12 w-44" />
              <DefaultButton text="Incluir" another_size="h-12 w-44" />
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
