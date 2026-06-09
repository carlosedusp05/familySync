import React, { useMemo } from "react";
import DefaultButton from "../../ui/DefaultButton.jsx";
import { pencilTerracotaIcon, trashIconRed } from "../../../assets";

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
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const localTotal = useMemo(() => {
    return expenses.reduce(
      (acc, curr) => acc + Number(curr.valor || curr.total || 0),
      0,
    );
  }, [expenses]);

  React.useEffect(() => {
    if (isOpen) setItemToDelete(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const isGastosPorSemana = title === "Gastos por Semana";
  const isGastosPorMes = title === "Gastos por Mês";

  const renderCalendarView = () => {
    const mesIndex = dataFiltroDia.getMonth();
    const year = dataFiltroDia.getFullYear();

    const nomesDosMeses = Object.keys(MESES_MAP);
    const nomeMes =
      nomesDosMeses.find((k) => MESES_MAP[k] === mesIndex) || "Mês";

    const diasNoMes = new Date(year, mesIndex + 1, 0).getDate();
    const primeiroDiaSemana = new Date(year, mesIndex, 1).getDay();

    const grade = Array(primeiroDiaSemana).fill(null);
    for (let i = 1; i <= diasNoMes; i++) grade.push(i);

    const diasComGasto = expenses
      .map((exp) => {
        if (!exp.data_movimentacao) return null;

        console.log(exp);
        const dateStr = exp.data_movimentacao.split("T")[0];
        const [anoStr, mesStr, diaStr] = dateStr.split("-");

        if (anoStr && mesStr && diaStr) {
          const expYear = parseInt(anoStr, 10);
          const expMonth = parseInt(mesStr, 10) - 1; // No JS, os meses vão de 0 a 11
          const expDay = parseInt(diaStr, 10);

          if (expYear === year && expMonth === mesIndex) {
            return expDay;
          }
        } else {
          const expDate = new Date(exp.data_movimentacao);
          if (
            expDate.getFullYear() === year &&
            expDate.getMonth() === mesIndex
          ) {
            return expDate.getDate();
          }
        }
        return null;
      })
      .filter(Boolean);

    return (
      <div className="flex flex-col w-full mt-2 animate-in fade-in zoom-in duration-200 items-center">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center shadow-sm w-full max-w-[340px]">
          <div className="flex justify-between items-center w-full px-4 mb-6">
            <span className="font-extrabold text-xl text-[#4a2511] capitalize">
              {nomeMes}
            </span>
            <span className="font-extrabold text-xl text-[#4a2511]">
              {year}
            </span>
          </div>

          <div className="w-full grid grid-cols-7 gap-2 mb-4 text-center text-gray-400 font-bold text-sm">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="w-full grid grid-cols-7 gap-2">
            {grade.map((diaNumero, index) => {
              if (!diaNumero) return <div key={`empty-${index}`} />;

              const temGasto = diasComGasto.includes(diaNumero);

              return (
                <button
                  key={diaNumero}
                  disabled={!temGasto}
                  onClick={() => {
                    if (onDayClick && temGasto) {
                      onDayClick({
                        exactDate: new Date(year, mesIndex, diaNumero),
                      });
                    }
                  }}
                  className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-full text-sm font-bold transition-all ${
                    temGasto
                      ? "text-[#4a2511] hover:bg-orange-100 hover:text-orange cursor-pointer"
                      : "text-gray-300 cursor-not-allowed opacity-50"
                  }`}
                >
                  {diaNumero}
                  {temGasto && (
                    <span className="absolute bottom-1 w-1 h-1 bg-orange rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span className="text-[#4a2511] font-black text-base">
              Total Gasto
            </span>
            <span className="text-orange font-bold text-sm bg-orange/10 px-3 py-1 rounded-full">
              R$ $
              {localTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-11/12 max-w-[650px] p-8 relative flex flex-col max-h-[85vh] overflow-hidden">
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
                  {itemToDelete.tipo || itemToDelete.descricao || "este item"}
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
            R$ $
            {localTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[150px]">
          {expenses.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium text-center">
              Nenhum gasto registrado neste período.
            </div>
          ) : isGastosPorMes ? (
            renderCalendarView()
          ) : isGastosPorSemana ? (
            <div className="flex flex-col gap-4">
              {expenses.map((semana, index) => {
                const nomeSemana =
                  semana.tipo || semana.semana_mes || `Semana ${index + 1}`;
                const totalSemana = Number(semana.valor || semana.total || 0);
                const diasComGastoSemana = semana.dias_com_gasto || [];

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
                        R$ $
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
                        const temGastoNesteDia = diasComGastoSemana.includes(
                          dia.nome,
                        );

                        return (
                          <button
                            key={dia.nome}
                            disabled={!temGastoNesteDia}
                            onClick={() => {
                              if (onDayClick) {
                                onDayClick({
                                  descricao: dia.nome,
                                  domDate: semana.domDate,
                                });
                              }
                            }}
                            className={`flex-1 min-w-[40px] py-2 rounded-xl font-extrabold text-[11px] text-center shadow-sm transition-all ${
                              temGastoNesteDia
                                ? "bg-orange text-white hover:brightness-110 active:scale-95 cursor-pointer"
                                : "bg-gray-200 text-gray-400 opacity-40 cursor-not-allowed"
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
                const nomeOriginal = item.tipo || item.descricao || "Gasto";
                const valorExibicao = Number(item.valor || item.total || 0);
                const isDiaDaSemana = DIAS_DA_SEMANA.includes(nomeOriginal);
                const isMes = Object.keys(MESES_MAP).includes(nomeOriginal);

                let nomeExibicao = nomeOriginal;
                if (nomeExibicao.length > 25) {
                  nomeExibicao = nomeExibicao.substring(0, 25) + "...";
                }

                const canEditDelete =
                  !!item.id_financas && !isDiaDaSemana && !isMes;

                return (
                  <li
                    key={item.id_financas || index}
                    title={nomeOriginal}
                    onClick={() => {
                      if ((isDiaDaSemana || isMes) && onDayClick) {
                        onDayClick(item);
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors gap-2 ${
                      isDiaDaSemana || isMes
                        ? "bg-orange-50/50 border-orange-100 hover:bg-orange-100/70 cursor-pointer"
                        : "bg-gray-50 border-gray-100 cursor-default"
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
                        R$ $
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
                            className="bg-blue-50 hover:bg-blue-100 p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
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
                              setItemToDelete(item);
                            }}
                            className="bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
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
