import axios from "axios";

// Configurar cliente HTTP
const api = axios.create({
  baseURL: "http://localhost:8080/v1/familysync",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET - Listar usuários
const getUsers = async function () {
  const url = "/usuario";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// GET - Pegar Usuário por ID
const getUserById = async function (id) {
  const url = `/usuario/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Criar Usuário
const createUser = async function (data) {
  const url = `/usuario`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// PUT - Editar Usuário
const updateUser = async function (id, data) {
  const url = `/usuario/${id}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// DELETE - Deletar Usuário
const deleteUser = async function (id) {
  const url = `/usuario/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Logar Usuário
const loginUser = async function (data) {
  const url = "/login";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const listUsersByFamily = async function (idFamily) {
  const url = `/usuario/familia/${idFamily}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const userServicce = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  listUsersByFamily,
};
