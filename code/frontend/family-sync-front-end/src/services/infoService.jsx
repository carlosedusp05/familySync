import api from "./api";

// GET - Listar informações
const getInfos = async function () {
  const url = "/usuarios-informacoes";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getInfosById = async function (id) {
  const url = `/usuario-informacao/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Criar Informação
const createInfo = async function (data) {
  const url = "/usuario-informacao";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// PUT - Editar Informação
const updateInfo = async function (id, data) {
  const url = `/usuario-informacao/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// DELETE - Deletar Informação
const deleteInfo = async function (id) {
  const url = `/usuario-informacao/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const infoService = {
  getInfos,
  getInfosById,
  createInfo,
  updateInfo,
  deleteInfo,
};
