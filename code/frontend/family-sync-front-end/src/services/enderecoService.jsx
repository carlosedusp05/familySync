import api from "./api";

const createEndereco = async function (data) {
  const url = "/endereco";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const enderecoService = { createEndereco };
