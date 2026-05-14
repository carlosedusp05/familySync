import { useState, useMemo, useEffect } from "react";

export function useFinancierData() {
  const [periodo, setPeriodo] = useState("Mês");
  const [tipoVisualizacao, setTipoVisualizacao] = useState("total");
  const [authorName, setAuthorName] = useState("Usuário");

  const [dadosPorPeriodo, setDadosPorPeriodo] = useState(() => {
    const saved = localStorage.getItem("@FamilySync:gastos");
    return saved
      ? JSON.parse(saved)
      : { Dia: [], Semana: [], Mês: [], Ano: [] };
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("@FamilySync:user");
    if (savedUser) setAuthorName(JSON.parse(savedUser).nome || "Usuário");
  }, []);

  const gastosAtuais = useMemo(
    () => dadosPorPeriodo[periodo] || [],
    [dadosPorPeriodo, periodo],
  );

  const totalGasto = useMemo(
    () => gastosAtuais.reduce((acc, curr) => acc + curr.valor, 0),
    [gastosAtuais],
  );

  const valorMaximo = useMemo(
    () =>
      gastosAtuais.length > 0
        ? Math.max(...gastosAtuais.map((i) => i.valor))
        : 1000,
    [gastosAtuais],
  );

  const labelsData = useMemo(() => {
    const hoje = new Date();
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const fmt = (d) =>
      d
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "");

    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay());
    const sabado = new Date(hoje);
    sabado.setDate(hoje.getDate() + (6 - hoje.getDay()));

    return {
      Dia: capitalize(
        hoje.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }),
      ),
      Semana: `${fmt(domingo)} - ${fmt(sabado)}`,
      Mês: `${fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1))} - ${fmt(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0))}`,
      Ano: `Janeiro - Dezembro ${hoje.getFullYear()}`,
    };
  }, []);

  const handleDeleteExpense = (id) => {
    const novosDados = { ...dadosPorPeriodo };
    Object.keys(novosDados).forEach(
      (p) => (novosDados[p] = novosDados[p].filter((i) => i.id !== id)),
    );
    setDadosPorPeriodo(novosDados);
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(novosDados));
  };

  const handleSaveExpense = (categoria, valor, emoji) => {
    const novosDados = { ...dadosPorPeriodo };
    ["Dia", "Semana", "Mês", "Ano"].forEach((p) => {
      const existente = novosDados[p].find((i) => i.label === categoria);
      if (existente) {
        novosDados[p] = novosDados[p].map((i) =>
          i.label === categoria ? { ...i, valor: i.valor + valor } : i,
        );
      } else {
        novosDados[p] = [
          ...novosDados[p],
          { label: categoria, valor, emoji, id: Date.now() },
        ];
      }
    });
    setDadosPorPeriodo(novosDados);
    localStorage.setItem("@FamilySync:gastos", JSON.stringify(novosDados));
  };

  return {
    periodo,
    setPeriodo,
    tipoVisualizacao,
    setTipoVisualizacao,
    gastosAtuais,
    totalGasto,
    valorMaximo,
    labelsData,
    authorName,
    handleDeleteExpense,
    handleSaveExpense,
  };
}
