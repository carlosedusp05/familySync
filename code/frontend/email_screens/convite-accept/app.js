"use strict";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const token = urlParams.get("token");
console.log(token);

const url = `https://tcc-back-q3kw.onrender.com/v1/familysync/usuario-familia/emailEnviado?token='${token}'`;
console.log(url);
const response = await fetch(url, {
  method: "POST", // ou 'PUT', dependendo do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(response);
