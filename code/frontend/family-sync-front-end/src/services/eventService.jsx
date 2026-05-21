import api from "./api";

// GET - Listar eventos
const getEvent = async function () {
  const url = "/evento";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// GET - Listar eventos por Id da Familia
const listEventsByFamily = async function (idFamily) {
  const url = `/evento/familia/${idFamily}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// GET - Pegar Evento por ID
const getEventById = async function (id) {
  const url = `/evento/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Criar Evento
const createEvent = async function (data) {
  const url = `/evento`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// PUT - Editar Evento
const updateEvent = async function (id, data) {
  const url = `/evento/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// DELETE - Deletar Evento
const deleteEvent = async function (id) {
  const url = `/evento/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const eventService = {
  getEvent,
  getEventById,
  listEventsByFamily,
  createEvent,
  updateEvent,
  deleteEvent,
};
