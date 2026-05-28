import { useState, useMemo, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { financeService } from "../services/financeService";

const PERIODOS = ["Dia", "Semana", "Mês", "Ano"];

const traduzirDia = {
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

const traduzirMes = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
};

export function useFinancier() {
  const [periodo, setPeriodoState] = useState("Mês");
  // NOVO: Estado para saber qual data o gráfico de "Dia" deve renderizar
  const [dataFiltroDia, setDataFiltroDia] = useState(new Date());

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [gastosAtuais, setGastosAtuais] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
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

  // NOVO: Sobrescrevemos o setPeriodo. Se o usuário clicar manualmente na aba "Dia", volta para a data de hoje.
  const setPeriodo = useCallback((novoPeriodo) => {
    if (novoPeriodo === "Dia") {
      setDataFiltroDia(new Date());
    }
    setPeriodoState(novoPeriodo);
  }, []);

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

      if (dados && Array.isArray(dados)) {
        setGastosAtuais(dados);
      } else if (
        dados?.Response?.financas &&
        Array.isArray(dados.Response.financas)
      ) {
        setGastosAtuais(dados.Response.financas);
      } else if (dados?.Response && Array.isArray(dados.Response)) {
        setGastosAtuais(dados.Response);
      } else if (dados?.data?.Response?.financas) {
        setGastosAtuais(dados.data.Response.financas);
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

  const processedData = useMemo(() => {
    const rawList = Array.isArray(gastosAtuais) ? gastosAtuais : [];
    let chartData = [];
    let listData = [];

    const d = dataFiltroDia;
    const filtroStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (periodo === "Dia") {
      const filtered = rawList.filter(
        (item) => (item.data_movimentacao || "").substring(0, 10) === filtroStr,
      );
      listData = filtered;
      chartData = filtered.map((item) => ({
        id_financas: item.id_financas,
        labelItem: item.tipo || item.descricao,
        valorItem: Number(item.valor || item.total || 0),
        icone: item.icone || "💰",
        rawItem: item,
        isGroup: false,
      }));
    } else if (periodo === "Semana") {
      listData = rawList;
      chartData = rawList.map((item, index) => {
        const diaBr = traduzirDia[item.dia_semana] || item.dia_semana;
        return {
          id_financas: `week-${index}`,
          labelItem: diaBr,
          valorItem: Number(item.total || item.valor || 0),
          icone: "📅",
          rawItem: {
            ...item,
            descricao: diaBr,
            icone: "📅",
            valor: item.total,
          },
          isGroup: true,
        };
      });
    } else if (periodo === "Mês") {
      listData = rawList;
      chartData = rawList.map((item, index) => ({
        id_financas: `month-${index}`,
        labelItem: item.semana_mes,
        valorItem: Number(item.total || item.valor || 0),
        icone: "📅",
        rawItem: {
          ...item,
          descricao: item.semana_mes,
          icone: "📅",
          valor: item.total,
        },
        isGroup: true,
      }));
    } else if (periodo === "Ano") {
      listData = rawList;
      chartData = rawList.map((item, index) => {
        const mesBr = traduzirMes[item.mes] || item.mes;
        return {
          id_financas: `year-${index}`,
          labelItem: mesBr,
          valorItem: Number(item.total || item.valor || 0),
          icone: "📅",
          rawItem: {
            ...item,
            descricao: mesBr,
            icone: "📅",
            valor: item.total,
          },
          isGroup: true,
        };
      });
    }

    return { listData, chartData };
  }, [gastosAtuais, periodo, dataFiltroDia]);

  const { totalGasto, valorMaximo } = useMemo(() => {
    const total = processedData.chartData.reduce(
      (acc, curr) => acc + curr.valorItem,
      0,
    );
    const maiorGastoAtual =
      processedData.chartData.length > 0
        ? Math.max(...processedData.chartData.map((item) => item.valorItem))
        : 0;
    const maxFinal = maiorGastoAtual > 0 ? maiorGastoAtual : 1000;

    return { totalGasto: total, valorMaximo: maxFinal };
  }, [processedData.chartData]);

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
        dataFiltroDia.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        }),
      ),
      Semana: `${fmt(dom)} - ${fmt(sab)}`,
      Mês: `${fmt(pMes)} - ${fmt(uMes)}`,
      Ano: `Janeiro - Dezembro ${hoje.getFullYear()}`,
    };
  }, [dataFiltroDia]);

  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await financeService.deleteFinancas(id);
      setGastosAtuais((prev) =>
        Array.isArray(prev)
          ? prev.filter((item) => item.id_financas !== id)
          : [],
      );
      setSelectedExpenses((prev) =>
        Array.isArray(prev)
          ? prev.filter((item) => item.id_financas !== id)
          : [],
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
        if (idToEdit) {
          await financeService.updateFinancas(idToEdit, payload);
        } else {
          await financeService.createFinancas(payload);
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

  const handleBarClick = useCallback((item) => {
    if (item.isGroup) {
      setSelectedExpenses([item.rawItem]);
      setIsListModalOpen(true);
    } else {
      setExpenseToEdit(item.rawItem);
      setIsFormModalOpen(true);
      setIsListModalOpen(false);
    }
  }, []);

  const handleDayClick = useCallback((item) => {
    const nomeDiaBr = item.descricao || item.tipo;
    const mapaDias = {
      Domingo: 0,
      Segunda: 1,
      Terça: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
      Sábado: 6,
    };

    const diaAlvo = mapaDias[nomeDiaBr];

    if (diaAlvo !== undefined) {
      const hoje = new Date();
      const diaAtual = hoje.getDay();
      const diferenca = diaAlvo - diaAtual;

      const dataClicada = new Date(hoje);
      dataClicada.setDate(hoje.getDate() + diferenca);

      setDataFiltroDia(dataClicada);
      setPeriodoState("Dia");
      setIsListModalOpen(false);
    }
  }, []);

  const handleOpenFullList = useCallback(() => {
    const listFormatted = processedData.listData.map((item) => {
      let desc = item.descricao;
      if (periodo === "Semana") desc = traduzirDia[item.dia_semana];
      if (periodo === "Mês") desc = item.semana_mes;
      if (periodo === "Ano") desc = traduzirMes[item.mes];
      return {
        ...item,
        descricao: desc,
        icone: item.icone || "📅",
        valor: item.total || item.valor,
      };
    });
    setSelectedExpenses(listFormatted);
    setIsListModalOpen(true);
  }, [processedData.listData, periodo]);

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
    chartData: processedData.chartData,
    selectedExpenses,
    totalGasto,
    valorMaximo,
    yAxisValues,
    labelsData,
    isLoading,
    handleDeleteExpense,
    handleSaveExpense,
    handleOpenAddForm,
    handleBarClick,
    handleOpenFullList,
    handleDayClick,
  };
}
