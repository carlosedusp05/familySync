const API_URL = "https://viacep.com.br/ws";

export const viaCepService = {
  async getDataByCep(cep) {
    const response = await fetch(`${API_URL}/${cep}/json/`);
    return await response.json();
  },
};
