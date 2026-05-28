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
  expenses,
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
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors group ${
                      isDiaDaSemana
                        ? "bg-orange-50/50 border-orange-100 cursor-pointer hover:bg-orange-100/70 hover:border-orange-300"
                        : "bg-gray-50 border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-white p-2 rounded-xl shadow-sm">
                        {item.icone || "💰"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 capitalize text-lg leading-tight">
                          {nomeExibicao}
                        </span>
                        {isDiaDaSemana && (
                          <span className="text-xs text-orange font-semibold mt-0.5">
                            Clique para ver o dia ➔
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-brown-dark text-lg">
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
                              onEdit(item);
                            }}
                            className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id_financas);
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

        <div className="mt-8 flex justify-center border-t border-gray-100 pt-6 z-10">
          <DefaultButton
            text="Novo Gasto"
            another_size="h-14 w-full max-w-[200px]"
            onClick={onAdd}
          />
        </div>
      </div>
    </div>
  );
}
