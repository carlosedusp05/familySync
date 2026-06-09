export const DIAS_DA_SEMANA_MAP = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};

export const getSemanaDoMes = (data) => {
  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1).getDay();
  return Math.ceil((data.getDate() + primeiroDia) / 7);
};

export const getLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const strData =
    typeof dateStr === "string"
      ? dateStr.substring(0, 10)
      : dateStr.toISOString().substring(0, 10);
  const [y, m, dStr] = strData.split("-");
  return new Date(Number(y), Number(m) - 1, Number(dStr));
};

export const agruparPorSemana = (gastosDiarios, mesIndex, ano) => {
  const gastosDoMes = gastosDiarios.filter((gasto) => {
    const dataObj = new Date(
      gasto.data_movimentacao.replace(/-/g, "/").replace(/T.+/, ""),
    );
    return dataObj.getMonth() === mesIndex && dataObj.getFullYear() === ano;
  });

  const semanasMap = {};

  gastosDoMes.forEach((gasto) => {
    const dataObj = new Date(
      gasto.data_movimentacao.replace(/-/g, "/").replace(/T.+/, ""),
    );
    const numeroSemana = getSemanaDoMes(dataObj);
    const nomeSemana = `Semana ${numeroSemana}`;
    const nomeDia = DIAS_DA_SEMANA_MAP[dataObj.getDay()];

    if (!semanasMap[nomeSemana]) {
      semanasMap[nomeSemana] = {
        semana_mes: nomeSemana,
        total: 0,
        dias_com_gasto: new Set(),
      };
    }

    semanasMap[nomeSemana].total += Number(gasto.valor || 0);
    semanasMap[nomeSemana].dias_com_gasto.add(nomeDia);
  });

  return Object.values(semanasMap)
    .map((semana) => ({
      ...semana,
      dias_com_gasto: Array.from(semana.dias_com_gasto),
    }))
    .sort((a, b) => a.semana_mes.localeCompare(b.semana_mes));
};
