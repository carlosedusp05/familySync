const API_URL = "http://localhost:8080";

export const infoService = {
  async getInfos() {
    const response = await fetch(`${API_URL}/usuarios-informacoes`);
    return await response.json();
  },

  async createInfo(dados) {
    const response = await fetch(`${API_URL}/usuario-informacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return await response.json();
  },

  async updateInfo(id, dados) {
    const response = await fetch(`${API_URL}/usuario-informacao/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    return await response.json();
  },

  async deleteInfo(id) {
    const response = await fetch(`${API_URL}/usuario-informacao/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};
