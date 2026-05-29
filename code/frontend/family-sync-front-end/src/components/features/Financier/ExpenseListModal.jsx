import React, { useMemo, useState, useEffect } from "react";
import DefaultButton from "../../ui/DefaultButton.jsx";
import { pencilTerracotaIcon, trashIconRed } from "../../../assets/index.jsx";

const DIAS_DA_SEMANA = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const MESES_MAP = {
  Janeiro: 0,
  Fevereiro: 1,
  Março: 2,
  Abril: 3,
  Maio: 4,
  Junho: 5,
  Julho: 6,
  Agosto: 7,
  Setembro: 8,
  Outubro: 9,
  Novembro: 10,
  Dezembro: 11,
};

export function ExpenseListModal({
  isOpen,
  expenses = [],
  title = "Detalhes dos Gastos",
  onClose,
  onEdit,
  onDelete,
  onAdd,
  onDayClick,
  dataFiltroDia = new Date(),
}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null); // Novo estado para confirmação

  const localTotal = useMemo(() => {
    return expenses.reduce(
      (acc, curr) => acc + Number(curr.valor || curr.total || 0),
      0,
    );
  }, [expenses]);

  useEffect(() => {
    if (isOpen) {
      if (title === "Gastos por Mês" && expenses.length === 1) {
        setSelectedMonth(expenses[0]);
      } else {
        setSelectedMonth(null);
      }
      setItemToDelete(null); // Reseta ao abrir
    }
  }, [isOpen, expenses, title]);

  if (!isOpen) return null;

  const isGastosPorSemana = title === "Gastos por Semana";
  const isGastosPorMes = title === "Gastos por Mês";

  const renderCalendarView = () => {
    const nomeMes = selectedMonth.descricao || selectedMonth.mes || "Maio";
    const year = dataFiltroDia.getFullYear();
    const mesIndex =
      MESES_MAP[nomeMes] !== undefined
        ? MESES_MAP[nomeMes]
        : new Date().getMonth();

    const firstDay = new Date(year, mesIndex, 1).getDay();
    const daysInMonth = new Date(year, mesIndex + 1, 0).getDate();

    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const blanks = Array.from({ length: startOffset }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const diasComGasto = selectedMonth.dias_com_gasto || [];

    return (
      <div className="flex flex-col w-full mt-2 animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col items-center gap-3 shadow-sm w-full">
          <div
            className={`flex justify-between items-center w-full max-w-[340px] px-2 mb-1 transition-opacity ${expenses.length > 1 ? "cursor-pointer group hover:opacity-80" : ""}`}
            onClick={() => {
              if (expenses.length > 1) {
                setSelectedMonth(null);
              }
            }}
            title={expenses.length > 1 ? "Ver todos os meses com gastos" : ""}
          >
            <span className="font-extrabold text-2xl text-brown-dark capitalize">
              {nomeMes}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-brown-dark">
                {year}
              </span>
              {expenses.length > 1 && (
                <button
                  className="bg-orange/10 p-1.5 rounded-md transition-transform group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMonth(null);
                  }}
                >
                  <img
                    src={pencilTerracotaIcon}
                    alt="Editar Mês"
                    className="h-4 w-4"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#F4EBE6] rounded-3xl w-full max-w-[340px] pb-6 shadow-sm overflow-hidden">
            <div className="bg-orange flex justify-between px-5 py-3 rounded-t-3xl text-white font-extrabold text-[13px] uppercase">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sab</span>
              <span>Dom</span>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-1 px-3 pt-5">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {days.map((d) => {
                const temGasto = diasComGasto.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => {
                      if (onDayClick) {
                        onDayClick({ exactDate: new Date(year, mesIndex, d) });
                      }
                    }}
                    className={`w-9 h-9 mx-auto flex items-center justify-center rounded-full font-extrabold text-[15px] transition-all cursor-pointer
                      ${
                        temGasto
                          ? "bg-orange text-white shadow-md hover:brightness-110 active:scale-95"
                          : "text-orange hover:bg-orange/10 active:scale-95"
                      }
                    `}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-[340px] flex justify-between items-center mt-3 pt-4 border-t border-gray-200">
            <span className="text-brown-dark font-black text-lg">
              Total Gasto
            </span>
            <span className="text-orange font-bold text-sm bg-orange/10 px-3 py-1 rounded-full">
              R${" "}
              {Number(
                selectedMonth.valor || selectedMonth.total || 0,
              ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Width Aumentado para max-w-[650px] */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-11/12 max-w-[650px] p-8 relative flex flex-col max-h-[85vh] overflow-hidden">
        {/* Confirmação de Deleção (Overlay interno) */}
        {itemToDelete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="p-8 flex flex-col items-center max-w-sm text-center">
              <div className="bg-red-50 p-4 rounded-full mb-4 shadow-sm border border-red-100">
                <img src={trashIconRed} alt="Lixeira" className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-brown-dark mb-2">
                Excluir gasto?
              </h3>
              <p className="text-gray-500 font-medium mb-8 text-lg">
                Tem certeza que deseja excluir{" "}
                <strong>
                  {itemToDelete.descricao || itemToDelete.tipo || "este item"}
                </strong>
                ? <br />
                <span className="text-sm">
                  Essa ação não pode ser desfeita.
                </span>
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (onDelete) onDelete(itemToDelete.id_financas);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-orange transition-colors shrink-0"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-orange font-bold uppercase tracking-wider text-[16px]">
            {title}
          </h2>
          <p className="text-brown-dark font-extrabold text-[36px] leading-none mt-2 break-words">
            R${" "}
            {localTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[150px]">
          {expenses.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium text-center">
              Nenhum gasto registrado neste período.
            </div>
          ) : isGastosPorMes && selectedMonth ? (
            renderCalendarView()
          ) : isGastosPorSemana ? (
            <div className="flex flex-col gap-4">
              {expenses.map((semana, index) => {
                const nomeSemana =
                  semana.descricao ||
                  semana.semana_mes ||
                  `Semana ${index + 1}`;
                const totalSemana = Number(semana.valor || semana.total || 0);
                const diasComGasto = semana.dias_com_gasto || [];

                return (
                  <div
                    key={semana.id_financas || index}
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2 gap-2">
                      <span className="text-brown-dark font-black text-lg truncate">
                        {nomeSemana}
                      </span>
                      <span className="text-orange font-bold text-sm bg-orange/10 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                        R${" "}
                        {totalSemana.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 justify-between">
                      {[
                        { nome: "Domingo", sigla: "DOM" },
                        { nome: "Segunda", sigla: "SEG" },
                        { nome: "Terça", sigla: "TER" },
                        { nome: "Quarta", sigla: "QUA" },
                        { nome: "Quinta", sigla: "QUI" },
                        { nome: "Sexta", sigla: "SEX" },
                        { nome: "Sábado", sigla: "SAB" },
                      ].map((dia) => {
                        const temGastoNesteDia =
                          diasComGasto.length === 0 ||
                          diasComGasto.includes(dia.nome);

                        return (
                          <button
                            key={dia.nome}
                            onClick={() => {
                              if (onDayClick) {
                                onDayClick({ descricao: dia.nome });
                              }
                            }}
                            className={`flex-1 min-w-[40px] py-2 rounded-xl font-extrabold text-[11px] text-center shadow-sm transition-all ${
                              temGastoNesteDia
                                ? "bg-orange text-white hover:brightness-110 active:scale-95 cursor-pointer"
                                : "bg-gray-200 text-gray-400 opacity-60 cursor-pointer"
                            }`}
                          >
                            {dia.sigla}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-3">
              {expenses.map((item, index) => {
                const nomeOriginal = item.descricao || item.tipo || "Gasto";
                const valorExibicao = Number(item.valor || item.total || 0);

                const isDiaDaSemana = DIAS_DA_SEMANA.includes(nomeOriginal);
                const isMes = Object.keys(MESES_MAP).includes(nomeOriginal);

                let nomeExibicao = nomeOriginal;
                if (nomeExibicao.length > 25) {
                  // Aumentei um pouquinho o limite do texto
                  nomeExibicao = nomeExibicao.substring(0, 25) + "...";
                }

                const canEditDelete =
                  !!item.id_financas && !isDiaDaSemana && !isMes;

                return (
                  <li
                    key={item.id_financas || index}
                    title={nomeOriginal}
                    onClick={() => {
                      if (isDiaDaSemana && onDayClick) {
                        onDayClick(item);
                      } else if (isMes) {
                        setSelectedMonth(item);
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors cursor-pointer gap-2 ${
                      isDiaDaSemana || isMes
                        ? "bg-orange-50/50 border-orange-100 hover:bg-orange-100/70"
                        : "bg-gray-50 border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-3xl p-2 rounded-xl shadow-sm bg-white shrink-0">
                        {item.icone || "💰"}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold capitalize text-lg leading-tight text-gray-800 truncate">
                          {nomeExibicao}
                        </span>
                        {(isDiaDaSemana || isMes) && (
                          <span className="text-xs font-semibold mt-0.5 text-orange">
                            Clique para ver detalhes ➔
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 shrink-0">
                      <span className="font-extrabold text-lg text-brown-dark whitespace-nowrap">
                        R${" "}
                        {valorExibicao.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>

                      {canEditDelete && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEdit) onEdit(item);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl transition-colors shrink-0"
                            title="Editar"
                          >
                            <img
                              src={pencilTerracotaIcon}
                              alt="Editar"
                              className="h-6 w-6"
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemToDelete(item); // Abre o overlay de confirmação
                            }}
                            className="bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors shrink-0"
                            title="Excluir"
                          >
                            <img
                              src={trashIconRed}
                              alt="Excluir"
                              className="h-6 w-6"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!isGastosPorSemana && !isGastosPorMes && (
          <div className="mt-8 flex justify-center border-t border-gray-100 pt-6 z-10 shrink-0">
            <DefaultButton
              text="Novo Gasto"
              another_size="h-14 w-full max-w-[200px]"
              onClick={onAdd}
            />
          </div>
        )}
      </div>
    </div>
  );
}
