"use strict";
import { BASE_URL } from "./config.js";

const loadingOverlay = document.getElementById("loading-overlay");
const lottieContainer = document.getElementById("lottie-container");
const animation = lottie.loadAnimation({
  container: lottieContainer,
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./img/orange-loading.json",
});

function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

async function processarConvite() {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (!token) {
      document.getElementById("familia").textContent =
        "Link de convite inválido.";
      hideLoading();
      return;
    }

    const base64Payload = token.split(".")[1];
    const payloadDecodificado = JSON.parse(atob(base64Payload));
    const id_familia = payloadDecodificado.id_familia;

    showLoading();

    await fetch(BASE_URL + `usuario-familia/emailEnviado?token=${token}`, {
      method: "POST",
    });

    const responseFamilia = await fetch(BASE_URL + `familia/${id_familia}`);
    const dadosFamilia = await responseFamilia.json();

    document.getElementById("familia").textContent =
      `Você foi cadastrado na família ${dadosFamilia.Response.familia[0].nome}`;

    setTimeout(() => {
      window.location.href = "familysync://dashboard";
    }, 800);
  } catch (error) {
    document.getElementById("familia").textContent =
      "Erro ao carregar os dados da família.";
  } finally {
    hideLoading();
  }
}

processarConvite();

window.abrirSite = function () {
  window.location.href = "https://familysync-tcc.vercel.app/";
};
