import api from "./api";

const getFamilies = async function () {
  const url = "/familias";

  try {
    const response = await api.get(url);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFamily = async function (data) {
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

const createFamilyEndereco = async function (data) {
  const url = "/familia/endereco/";

  try {
    const response = await api.post(url, data);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const getFamilyComplete = async function (id) {
  const url = `/familia/${id}/completa`;

  try {
    const response = await api.get(url, id);
    const dados = response.data;

    return dados;
  } catch (error) {
    throw error.response?.data;
  }
};

const createMemberByEmailFamily = async function (data) {
  const url = "/usuariio-familia/email/";

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
  getFamily,
  createFamily,
  createFamilyEndereco,
  getFamilyComplete,
  createMemberByEmailFamily,
};
