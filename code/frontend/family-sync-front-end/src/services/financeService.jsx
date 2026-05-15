import api from "./api";

const getFinancas = async function () {
  const url = "/financas";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFinancasDailyByIdFamily = async function (id) {
  const url = `/financas/diarias/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFinancasWeekByIdFamily = async function (id) {
  const url = `/financas/semanais/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFinancasMonthlyByIdFamily = async function (id) {
  const url = `/financas/mensais/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFinancasYearlyByIdFamily = async function (id) {
  const url = `/financas/anuais/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Criar Informação
const createFinancas = async function (data) {
  const url = "/financas";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// PUT - Editar Informação
const updateFinancas = async function (id, data) {
  const url = `/financas/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// DELETE - Deletar Informação
const deleteFinancas = async function (id) {
  const url = `/financas/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const financeService = {
  getFinancas,
  getFinancasDailyByIdFamily,
  getFinancasWeekByIdFamily,
  getFinancasMonthlyByIdFamily,
  getFinancasYearlyByIdFamily,
  createFinancas,
  updateFinancas,
  deleteFinancas,
};
