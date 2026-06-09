import api from "./api";

// GET - Listar todas as permissões (Livre para visualização)
const getPermissoes = async function () {
  const url = "/permissoes";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// GET - Pegar Permissão de um Usuário específico na Família (Livre para visualização)
const getPermissaoUsuario = async function (idUsuario, idFamilia) {
  const url = `/permissoes/usuario/${idUsuario}/familia/${idFamilia}`;

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

// POST - Criar Permissão (Bloqueado caso não tenha acesso no back-end)
const createPermissao = async function (data) {
  const url = `/permissao`;

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    // Tratamento específico: se o back-end barrar a requisição (ex: Status 403 Forbidden)
    if (error.response?.status === 403) {
      throw {
        message:
          "Acesso negado: Você possui permissão apenas para visualização.",
      };
    }
    throw error.response?.data;
  }
};

// PUT - Editar Permissão (Bloqueado caso não tenha acesso no back-end)
const updatePermissao = async function (data) {
  const url = `/permissao`;

  try {
    const response = await api.put(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    if (error.response?.status === 403) {
      throw {
        message:
          "Acesso negado: Você possui permissão apenas para visualização.",
      };
    }
    throw error.response?.data;
  }
};

// DELETE - Deletar Permissão (Bloqueado caso não tenha acesso no back-end)
const deletePermissao = async function (idUsuario, idFamilia) {
  const url = `/permissao/usuario/${idUsuario}/familia/${idFamilia}`;

  try {
    const response = await api.delete(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    if (error.response?.status === 403) {
      throw {
        message:
          "Acesso negado: Você possui permissão apenas para visualização.",
      };
    }
    throw error.response?.data;
  }
};

export const permissaoService = {
  getPermissoes,
  getPermissaoUsuario,
  createPermissao,
  updatePermissao,
  deletePermissao,
};
