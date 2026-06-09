import api from "./api";

const getListsByFamily = async function (idFamily) {
  const url = `/lista/completa/familia/${idFamily}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const createList = async function (data) {
  const url = `/lista`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const updateList = async function (id, data) {
  console.log("ID DA LISTA:", id);
  console.log("DADOS PARA ATUALIZAR:", data);
  const url = `/lista/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    console.log(dados);

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const deleteList = async function (id) {
  const url = `/lista/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// ItemService
const getItems = async function () {
  const url = `/lista/completa/familia`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const updateFavoritesBatch = async function (lists) {
  const formattedLists = lists.map((list) => ({
    ...list,
    favorita: list.favorita ? 1 : 0,
  }));

  const url = "/lista-favorita-lote";

  try {
    const response = await api.put(url, formattedLists);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const createItems = async function (data) {
  const url = `/item`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const updateItem = async function (data) {
  const url = `/item/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const deleteItem = async function (idItem) {
  const url = `/item/${idItem}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const updateItemsBatch = async function (items) {
  const url = "/item/lote";

  try {
    const response = await api.put(url, items);

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const listService = {
  getListsByFamily,
  createList,
  updateList,
  deleteList,
  getItems,
  createItems,
  deleteItem,
  updateItem,
  updateItemsBatch,
  updateFavoritesBatch,
};
