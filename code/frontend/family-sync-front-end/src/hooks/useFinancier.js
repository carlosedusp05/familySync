import { useState, useMemo, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { financeService } from "../services/financeService";

const PERIODOS = ["Dia", "Semana", "Mês", "Ano"];

export function useFinancier() {
  const [periodo, setPeriodo] = useState("Mês");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [gastosAtuais, setGastosAtuais] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

  const fetchGastos = useCallback(async () => {
    setIsLoading(true);
    try {
      let dados = null;

      if (periodo === "Dia")
        dados = await financeService.getFinancasDailyByIdFamily(idFamilia);
      if (periodo === "Semana")
        dados = await financeService.getFinancasWeekByIdFamily(idFamilia);
      if (periodo === "Mês")
        dados = await financeService.getFinancasMonthlyByIdFamily(idFamilia);
      if (periodo === "Ano")
        dados = await financeService.getFinancasYearlyByIdFamily(idFamilia);

      console.log(dados);

      if (dados && Array.isArray(dados)) {
        setGastosAtuais(dados);
      } else if (dados && Array.isArray(dados.Response)) {
        setGastosAtuais(dados.Response);
      } else {
        setGastosAtuais([]);
      }
    } catch (error) {
      console.error(`Erro ao buscar os gastos do tipo: ${periodo}`, error);
      setGastosAtuais([]);
    } finally {
      setIsLoading(false);
    }
  }, [periodo, idFamilia]);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  const { totalGasto, valorMaximo } = useMemo(() => {
    const listaValida = Array.isArray(gastosAtuais) ? gastosAtuais : [];

    const total = listaValida.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const max =
      listaValida.length > 0
        ? Math.max(...listaValida.map((item) => item.valor || 0))
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

  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await financeService.deleteFinancas(id);
      setGastosAtuais((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : [],
      );
    } catch (error) {
      console.error("Erro ao deletar gasto:", error);
    }
  }, []);

  const handleSaveExpense = useCallback(
    async (categoria, valor, emoji, descricao, idToEdit) => {
      try {
        const payload = {
          id_familia: idFamilia,
          tipo: categoria,
          valor,
          icone: emoji,
          descricao: descricao,
        };

        console.log(payload);

        if (idToEdit) {
          await financeService.updateFinancas(idToEdit, payload);
        } else {
          const financas_retorno = await financeService.createFinancas(payload);
          console.log(financas_retorno);
        }

        await fetchGastos();

        setIsFormModalOpen(false);
        setExpenseToEdit(null);
      } catch (error) {
        console.error("Erro ao salvar gasto:", error);
      }
    },
    [fetchGastos, idFamilia],
  );

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
    periodo,
    setPeriodo,
    hoveredIndex,
    setHoveredIndex,
    isFormModalOpen,
    setIsFormModalOpen,
    isListModalOpen,
    setIsListModalOpen,
    expenseToEdit,
    setExpenseToEdit,
    authorName,
    gastosAtuais: Array.isArray(gastosAtuais) ? gastosAtuais : [],
    totalGasto,
    valorMaximo,
    yAxisValues,
    labelsData,
    isLoading,
    handleDeleteExpense,
    handleSaveExpense,
    handleOpenEditForm,
    handleOpenAddForm,
  };
}
