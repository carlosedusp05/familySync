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

const ordemDias = {
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
  Domingo: 7,
};

export function useFinancier() {
  const [periodo, setPeriodoState] = useState("Mês");
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

  const setPeriodo = useCallback((novoPeriodo) => {
    if (novoPeriodo === "Dia") {
      setDataFiltroDia(new Date());
    }
    setPeriodoState(novoPeriodo);
  }, []);

  const fetchGastos = useCallback(async () => {
    setIsLoading(true);
    try {
      // Trazemos SEMPRE a lista crua e completa do backend
      const dados = await financeService.getFinancasDailyByIdFamily(idFamilia);

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
      console.error("Erro ao buscar os gastos completos", error);
      setGastosAtuais([]);
    } finally {
      setIsLoading(false);
    }
  }, [idFamilia]);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  const processedData = useMemo(() => {
    const rawList = Array.isArray(gastosAtuais) ? gastosAtuais : [];
    let chartData = [];
    let listData = [];

    const d = new Date(dataFiltroDia);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");

    const filtroDiaStr = `${year}-${month}-${date}`;
    const filtroMesStr = `${year}-${month}`;
    const filtroAnoStr = `${year}`;

    // 🔥 Função salva-vidas para evitar o bug de fuso horário (UTC vs Local)
    const getLocalDate = (dateStr) => {
      const [y, m, dStr] = dateStr.substring(0, 10).split("-");
      return new Date(Number(y), Number(m) - 1, Number(dStr));
    };

    // Limites exatos da Semana (Domingo a Sábado) baseados no dataFiltroDia
    const dom = new Date(d);
    dom.setDate(d.getDate() - d.getDay());
    dom.setHours(0, 0, 0, 0);

    const sab = new Date(d);
    sab.setDate(d.getDate() + (6 - d.getDay()));
    sab.setHours(23, 59, 59, 999);

    if (periodo === "Dia") {
      const filtered = rawList.filter(
        (item) =>
          (item.data_movimentacao || "").substring(0, 10) === filtroDiaStr,
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
      const filtered = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        // Usamos a função blindada contra fuso horário aqui
        const itemDate = getLocalDate(item.data_movimentacao);
        return itemDate >= dom && itemDate <= sab;
      });

      // Agrupando e somando os valores por Dia da Semana
      const agrupado = {};
      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];

      filtered.forEach((item) => {
        const itemDate = getLocalDate(item.data_movimentacao);
        const nomeDia = diasSemana[itemDate.getDay()];
        if (!agrupado[nomeDia]) agrupado[nomeDia] = 0;
        agrupado[nomeDia] += Number(item.valor || item.total || 0);
      });

      listData = filtered;
      chartData = Object.keys(agrupado)
        .sort((a, b) => (ordemDias[a] || 99) - (ordemDias[b] || 99))
        .map((diaBr, index) => ({
          id_financas: `week-${index}`,
          labelItem: diaBr,
          valorItem: agrupado[diaBr],
          icone: "📅",
          rawItem: {
            descricao: diaBr,
            icone: "📅",
            valor: agrupado[diaBr],
            isVirtual: true,
          },
          isGroup: true,
        }));
    } else if (periodo === "Mês") {
      const filtered = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        return (item.data_movimentacao || "").substring(0, 7) === filtroMesStr;
      });

      // Agrupando e somando os valores por Semana do Mês
      const agrupado = {};
      filtered.forEach((item) => {
        // Pega o dia direto da string: "2026-06-15" -> 15
        const diaMes = parseInt(item.data_movimentacao.substring(8, 10), 10);
        const semana = `Semana ${Math.ceil(diaMes / 7)}`;
        if (!agrupado[semana]) agrupado[semana] = 0;
        agrupado[semana] += Number(item.valor || item.total || 0);
      });

      listData = filtered;
      chartData = Object.keys(agrupado)
        .sort()
        .map((semana, index) => ({
          id_financas: `month-${index}`,
          labelItem: semana,
          valorItem: agrupado[semana],
          icone: "📅",
          rawItem: {
            descricao: semana,
            icone: "📅",
            valor: agrupado[semana],
            isVirtual: true,
          },
          isGroup: true,
        }));
    } else if (periodo === "Ano") {
      const filtered = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        return (item.data_movimentacao || "").substring(0, 4) === filtroAnoStr;
      });

      // Agrupando e somando os valores por Mês
      const agrupado = {};
      const mesesStr = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      filtered.forEach((item) => {
        const mesIndex =
          parseInt(item.data_movimentacao.substring(5, 7), 10) - 1;
        const nomeMes = mesesStr[mesIndex];
        if (!agrupado[nomeMes]) agrupado[nomeMes] = 0;
        agrupado[nomeMes] += Number(item.valor || item.total || 0);
      });

      listData = filtered;
      chartData = Object.keys(agrupado)
        .sort((a, b) => mesesStr.indexOf(a) - mesesStr.indexOf(b))
        .map((mesBr, index) => ({
          id_financas: `year-${index}`,
          labelItem: mesBr,
          valorItem: agrupado[mesBr],
          icone: "📅",
          rawItem: {
            descricao: mesBr,
            icone: "📅",
            valor: agrupado[mesBr],
            isVirtual: true,
          },
          isGroup: true,
        }));
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
    const d = new Date(dataFiltroDia);
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const fmt = (dateObj) =>
      dateObj
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "");

    const dom = new Date(d);
    dom.setDate(d.getDate() - d.getDay());
    const sab = new Date(d);
    sab.setDate(d.getDate() + (6 - d.getDay()));

    return {
      Dia: capitalize(
        d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        }),
      ),
      Semana: `${fmt(dom)} - ${fmt(sab)}`,
      Mês: capitalize(
        d.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
      ),
      Ano: `Janeiro - Dezembro ${d.getFullYear()}`,
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
    if (item.exactDate) {
      setDataFiltroDia(item.exactDate);
      setPeriodoState("Dia");
      setIsListModalOpen(false);
      return;
    }

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
      if (periodo === "Mês") desc = item.semana_mes || item.data_movimentacao;
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
    dataFiltroDia,
    listData: processedData.listData,
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
