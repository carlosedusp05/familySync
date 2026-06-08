import { useState, useMemo, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { financeService } from "../services/financeService";

const PERIODOS = ["Dia", "Semana", "Mês", "Ano"];

// 🛠️ Função utilitária global para evitar problemas com fuso horário local ao quebrar a string de data
const getLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [y, m, dStr] = dateStr.substring(0, 10).split("-");
  return new Date(Number(y), Number(m) - 1, Number(dStr));
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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const mesesDisponiveis = useMemo(() => {
    const rawList = Array.isArray(gastosAtuais) ? gastosAtuais : [];
    const meses = rawList
      .filter((item) => item.data_movimentacao)
      .map((item) => item.data_movimentacao.substring(0, 7));

    const filtroMesStr = dataFiltroDia.toISOString().substring(0, 7);
    if (!meses.includes(filtroMesStr)) {
      meses.push(filtroMesStr);
    }
    return [...new Set(meses)].sort();
  }, [gastosAtuais, dataFiltroDia]);

  const handlePeriodLabelClick = useCallback(() => {
    if (periodo === "Mês") {
      if (mesesDisponiveis.length <= 1) return;
      const currentMesStr = dataFiltroDia.toISOString().substring(0, 7);
      const currentIndex = mesesDisponiveis.indexOf(currentMesStr);

      let nextIndex = currentIndex + 1;
      if (nextIndex >= mesesDisponiveis.length) {
        nextIndex = 0;
      }

      const [anoStr, mesStr] = mesesDisponiveis[nextIndex].split("-");
      setDataFiltroDia(
        new Date(parseInt(anoStr, 10), parseInt(mesStr, 10) - 1, 1),
      );
    }
  }, [periodo, mesesDisponiveis, dataFiltroDia]);

  // 📊 Processamento Principal: Gráfico de Barras (Desktop) e Lista
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

    const dom = new Date(d);
    dom.setDate(d.getDate() - d.getDay());
    dom.setHours(0, 0, 0, 0);

    const sab = new Date(d);
    sab.setDate(d.getDate() + (6 - d.getDay()));
    sab.setHours(23, 59, 59, 999);

    if (periodo === "Dia") {
      listData = rawList.filter(
        (item) =>
          (item.data_movimentacao || "").substring(0, 10) === filtroDiaStr,
      );
      chartData = listData.map((item) => ({
        id_financas: item.id_financas,
        labelItem: item.tipo || item.descricao,
        valorItem: Number(item.valor || item.total || 0),
        icone: item.icone || "💰",
        rawItem: item,
        isGroup: false,
      }));
    } else if (periodo === "Semana") {
      listData = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        const itemDate = getLocalDate(item.data_movimentacao);
        return itemDate >= dom && itemDate <= sab;
      });

      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      const agrupado = Object.fromEntries(diasSemana.map((dia) => [dia, 0]));

      listData.forEach((item) => {
        const itemDate = getLocalDate(item.data_movimentacao);
        agrupado[diasSemana[itemDate.getDay()]] += Number(
          item.valor || item.total || 0,
        );
      });

      const diasOrdenados = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo",
      ];
      chartData = diasOrdenados.map((diaBr, index) => ({
        id_financas: `week-${index}`,
        labelItem: diaBr,
        valorItem: agrupado[diaBr],
        icone: "📅",
        rawItem: {
          descricao: diaBr,
          icone: "📅",
          valor: agrupado[diaBr],
          isVirtual: true,
          domDate: dom,
        },
        isGroup: true,
      }));
    } else if (periodo === "Mês") {
      listData = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        return (item.data_movimentacao || "").substring(0, 7) === filtroMesStr;
      });

      const weeksMap = {};
      const diasSemana = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];

      listData.forEach((item) => {
        const itemDate = getLocalDate(item.data_movimentacao);
        const startOfWeek = new Date(itemDate);
        startOfWeek.setDate(itemDate.getDate() - itemDate.getDay());
        const endOfWeek = new Date(itemDate);
        endOfWeek.setDate(itemDate.getDate() + (6 - itemDate.getDay()));

        const keyStr = startOfWeek.toISOString().substring(0, 10);
        if (!weeksMap[keyStr]) {
          const fmt = (dateObj) =>
            dateObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });
          weeksMap[keyStr] = {
            descricao: `Semana de ${fmt(startOfWeek)} a ${fmt(endOfWeek)}`,
            semana_mes: `Semana de ${fmt(startOfWeek)} a ${fmt(endOfWeek)}`,
            valor: 0,
            dias_com_gasto: new Set(),
            icone: "📅",
            isVirtual: true,
            domDate: startOfWeek,
          };
        }
        weeksMap[keyStr].valor += Number(item.valor || item.total || 0);
        weeksMap[keyStr].dias_com_gasto.add(diasSemana[itemDate.getDay()]);
      });

      chartData = Object.keys(weeksMap)
        .sort()
        .map((key, index) => {
          const w = weeksMap[key];
          return {
            id_financas: `month-week-${index}`,
            labelItem: w.descricao,
            valorItem: w.valor,
            icone: "📅",
            isGroup: true,
            rawItem: {
              ...w,
              id_financas: `month-week-raw-${index}`,
              total: w.valor,
              dias_com_gasto: Array.from(w.dias_com_gasto),
            },
          };
        });
    } else if (periodo === "Ano") {
      listData = rawList.filter((item) => {
        if (!item.data_movimentacao) return false;
        return (item.data_movimentacao || "").substring(0, 4) === filtroAnoStr;
      });

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
      const agrupado = Object.fromEntries(mesesStr.map((mes) => [mes, 0]));

      listData.forEach((item) => {
        const mesIndex =
          parseInt(item.data_movimentacao.substring(5, 7), 10) - 1;
        if (mesesStr[mesIndex]) {
          agrupado[mesesStr[mesIndex]] += Number(item.valor || item.total || 0);
        }
      });

      chartData = mesesStr.map((mesBr, index) => ({
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

  // 🍕 Processamento Exclusivo: Gráfico de Pizza (Mobile) - Agrupamento por Categoria
  const pieChartData = useMemo(() => {
    if (!processedData.listData || processedData.listData.length === 0)
      return [];

    const agrupado = {};
    processedData.listData.forEach((item) => {
      const categoria = item.tipo || "Outros";
      if (!agrupado[categoria]) {
        agrupado[categoria] = {
          id_financas: `pie-${categoria}`,
          labelItem: categoria,
          valorItem: 0,
          icone: item.icone || "💰",
        };
      }
      agrupado[categoria].valorItem += Number(item.valor || item.total || 0);
    });

    // Remove categorias zeradas e ordena da maior despesa para a menor
    return Object.values(agrupado)
      .filter((item) => item.valorItem > 0)
      .sort((a, b) => b.valorItem - a.valorItem);
  }, [processedData.listData]);

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
        d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
      ),
      Semana: `${fmt(dom)} - ${fmt(sab)}`,
      Mês: capitalize(
        d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
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

  const handleBarClick = useCallback(
    (item) => {
      if (item.isGroup) {
        if (periodo === "Ano") {
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
          const mesIndex = mesesStr.indexOf(item.labelItem);

          const gastosDoMes = processedData.listData
            .filter((g) => {
              if (!g.data_movimentacao) return false;
              const gDate = getLocalDate(g.data_movimentacao);
              return gDate.getMonth() === mesIndex;
            })
            .map((g) => ({
              ...g,
              descricao: `${item.labelItem} - ${g.descricao || g.tipo}`,
              icone: g.icone || "📅",
              valor: g.valor || g.total || 0,
            }));

          setSelectedExpenses(gastosDoMes);
          setIsListModalOpen(true);
        } else if (periodo === "Semana") {
          const diasSemana = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ];
          const diaIndex = diasSemana.indexOf(item.labelItem);

          const gastosDoDia = processedData.listData
            .filter((g) => {
              if (!g.data_movimentacao) return false;
              const gDate = getLocalDate(g.data_movimentacao);
              return gDate.getDay() === diaIndex;
            })
            .map((g) => ({
              ...g,
              descricao: `${item.labelItem} - ${g.descricao || g.tipo}`,
              icone: g.icone || "📅",
              valor: g.valor || g.total || 0,
            }));

          setSelectedExpenses(gastosDoDia);
          setIsListModalOpen(true);
        } else {
          setSelectedExpenses([item.rawItem]);
          setIsListModalOpen(true);
        }
      } else {
        setExpenseToEdit(item.rawItem);
        setIsFormModalOpen(true);
        setIsListModalOpen(false);
      }
    },
    [periodo, processedData.listData],
  );

  const handleDayClick = useCallback(
    (item) => {
      if (item.exactDate) {
        setDataFiltroDia(item.exactDate);
        setPeriodoState((prev) => (prev === "Semana" ? "Semana" : "Dia"));
        setIsListModalOpen(false);
        return;
      }

      const nomeDiaBr = item.descricao || item.tipo;

      if (
        item.id_financas &&
        String(item.id_financas).startsWith("month-week")
      ) {
        if (item.domDate) {
          setDataFiltroDia(new Date(item.domDate));
          setPeriodoState("Semana");
          setIsListModalOpen(false);
          return;
        }
      }

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
      const mesIndex = mesesStr.indexOf(nomeDiaBr);
      if (mesIndex !== -1) {
        const novaData = new Date(dataFiltroDia.getFullYear(), mesIndex, 1);
        setDataFiltroDia(novaData);
        setPeriodoState("Mês");
        setIsListModalOpen(false);
        return;
      }

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
        const baseDate = item.domDate
          ? new Date(item.domDate)
          : new Date(dataFiltroDia);
        const diaAtual = baseDate.getDay();
        const diferenca = diaAlvo - diaAtual;

        const dataClicada = new Date(baseDate);
        dataClicada.setDate(baseDate.getDate() + diferenca);

        setDataFiltroDia(dataClicada);
        setPeriodoState("Dia");
        setIsListModalOpen(false);
      }
    },
    [dataFiltroDia],
  );

  const handleOpenFullList = useCallback(() => {
    if (periodo === "Mês" || periodo === "Ano") {
      const listFormatted = processedData.chartData.map((c) => c.rawItem);
      setSelectedExpenses(listFormatted);
      setIsListModalOpen(true);
      return;
    }

    const listFormatted = processedData.listData.map((item) => {
      let desc = item.descricao || item.tipo;

      if (periodo === "Semana") {
        const itemDate = getLocalDate(item.data_movimentacao);
        const diasSemana = [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ];
        const nomeDia = diasSemana[itemDate.getDay()];
        desc = `${nomeDia} - ${item.descricao || item.tipo}`;
      }

      return {
        ...item,
        descricao: desc,
        icone: item.icone || "📅",
        valor: item.valor || item.total || 0,
      };
    });

    setSelectedExpenses(listFormatted);
    setIsListModalOpen(true);
  }, [processedData.chartData, processedData.listData, periodo]);

  const handleOpenAddForm = () => {
    setExpenseToEdit(null);
    setIsFormModalOpen(true);
    setIsListModalOpen(false);
  };

  const diasComGastos = useMemo(() => {
    const rawList = Array.isArray(gastosAtuais) ? gastosAtuais : [];
    const datas = rawList
      .filter((item) => item.data_movimentacao)
      .map((item) => item.data_movimentacao.substring(0, 10));

    return [...new Set(datas)].sort();
  }, [gastosAtuais]);

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
    pieChartData,
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
    handlePeriodLabelClick,
    isCalendarOpen,
    setIsCalendarOpen,
    diasComGastos,
  };
}
