import api from "./api";

const getFamilies = async function (data) {
  const url = "/familias";

  try {
    const response = await api.get(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const createFamily = async function (data) {
  const url = "/familia";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

export const familyService = {
  getFamilies,
  createFamily,
};
