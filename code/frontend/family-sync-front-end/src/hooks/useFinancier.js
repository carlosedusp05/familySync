import { useState, useMemo, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const PERIODOS = ["Dia", "Semana", "Mês", "Ano"];
const OPCOES_VISUALIZACAO = ["total", "dia", "semana", "mês", "ano"];

export function useFinancier() {
  const [periodo, setPeriodo] = useState("Mês");
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    try {
      const token = Cookies.get("familysync_token");
      if (!token) return "Usuário";
      const decoded = jwtDecode(token);
      return decoded?.nome || "Usuário";
    } catch (error) {
      console.error("Erro ao ler o token do usuário:", error);
      return "Usuário";
    }
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

  return {
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
    gastosAtuais,
    totalGasto,
    valorMaximo,
    yAxisValues,
    labelsData,
    handleDeleteExpense,
    handleSaveExpense,
    handleOpenEditForm,
    handleOpenAddForm,
  };
}
