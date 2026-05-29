import React, { useMemo } from "react";
import DefaultButton from "../../ui/DefaultButton.jsx";

const DIAS_DA_SEMANA = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export function ExpenseListModal({
  isOpen,
  expenses = [],
  title = "Detalhes dos Gastos",
  onClose,
  onEdit,
  onDelete,
  onAdd,
  onDayClick,
}) {
  const localTotal = useMemo(() => {
    return expenses.reduce(
      (acc, curr) => acc + Number(curr.valor || curr.total || 0),
      0,
    );
  }, [expenses]);

  if (!isOpen) return null;

  const isGastosPorSemana = title === "Gastos por Semana";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-11/12 max-w-lg p-8 relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-orange transition-colors"
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
          <p className="text-brown-dark font-extrabold text-[36px] leading-none mt-2">
            R${" "}
            {localTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[150px]">
          {expenses.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium">
              Nenhum gasto registrado neste período.
            </div>
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
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-brown-dark font-black text-lg">
                        {nomeSemana}
                      </span>
                      <span className="text-orange font-bold text-sm bg-orange/10 px-3 py-1 rounded-full">
                        Gastos: R${" "}
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
                            className={`flex-1 min-w-[45px] py-2 rounded-xl font-extrabold text-[11px] text-center shadow-sm transition-all ${
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

                let nomeExibicao = nomeOriginal;
                if (nomeExibicao.length > 20) {
                  nomeExibicao = nomeExibicao.substring(0, 20) + "...";
                }

                const canEditDelete = !!item.id_financas && !isDiaDaSemana;

                return (
                  <li
                    key={item.id_financas || index}
                    title={nomeOriginal}
                    onClick={() => {
                      if (isDiaDaSemana && onDayClick) {
                        onDayClick(item);
                      }
                    }}
                    // ⏪ Listagem comum retornada ao padrão original (sempre clicável)
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors group cursor-pointer ${
                      isDiaDaSemana
                        ? "bg-orange-50/50 border-orange-100 hover:bg-orange-100/70 hover:border-orange-300"
                        : "bg-gray-50 border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl p-2 rounded-xl shadow-sm bg-white">
                        {item.icone || "💰"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold capitalize text-lg leading-tight text-gray-800">
                          {nomeExibicao}
                        </span>
                        {isDiaDaSemana && (
                          <span className="text-xs font-semibold mt-0.5 text-orange">
                            Clique para ver o dia ➔
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-lg text-brown-dark">
                        R${" "}
                        {valorExibicao.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>

                      {canEditDelete && (
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEdit) onEdit(item);
                            }}
                            className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDelete) onDelete(item.id_financas);
                            }}
                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            🗑️
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

        {!isGastosPorSemana && (
          <div className="mt-8 flex justify-center border-t border-gray-100 pt-6 z-10">
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
