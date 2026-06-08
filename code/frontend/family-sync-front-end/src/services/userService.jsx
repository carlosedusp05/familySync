import api from "./api";
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
    const response = await api.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

const getUsersFamily = async function () {
  const url = `/usuarios-familia/`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const listUsersByFamily = async function (idFamily) {
  const url = `/usuario-familia/${idFamily}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const createUserFamily = async function (data) {
  const url = "/usuario-familia";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const deleteUserFamily = async function (id) {
  const url = `/usuario-familia/${id}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const addUserFamilyByEmail = async function (data) {
  const url = "/usuario-familia/email/";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFamiliesByUser = async function (id) {
  try {
    const [response, familias] = await Promise.all([
      userService.getUserById(id),
      userService.getUsersFamily(),
    ]);

    const familiasDoUsuario = familias.dados.filter((familia) =>
      familia.membros.some((membro) => membro.id_usuario === id),
    );

    const familiasFormatadas = familiasDoUsuario.map((f) => ({
      id: f.id_familia,
      nome: f.nome_familia,
    }));

    const result = {
      user: response.Response[0],
      family: familiasFormatadas,
    };

    return result;
  } catch (error) {
    throw error.response?.data;
  }
};

const getNotificationsByUser = async function (id) {
  const url = `/usuario-notificacao/${id}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const sendEmailForRememberPass = async function (email) {
  const url = `/senha-nova/code?email=${email}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// PUT - Trocar Senha (Esqueci minha senha)
const changePassword = async function (data, token) {
  const url = `/usuario/trocar-senha?token=${token}`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  listUsersByFamily,
  createUserFamily,
  addUserFamilyByEmail,
  getUsersFamily,
  getFamiliesByUser,
  getNotificationsByUser,
  sendEmailForRememberPass,
  changePassword,
};
