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
  const url = `/lista/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

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

const createItems = async function (data) {
  console.log(data);
  const url = `/item`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
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
};
