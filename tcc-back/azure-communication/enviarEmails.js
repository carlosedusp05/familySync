/***********************************************
 * Objetivo: Arquivo de responsavel pelo envio do email
 * Autor: Gustavo de Paula Silva
 * Data: 14/05/2026
 * Versão: 1.0
 ************************************************/

require('dotenv').config();

const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING']

const client = new EmailClient(connectionString); 
const emails = require('./emails.js');

const enviarNovaSenha = async function(destinatario, code){
    const poller = await client.beginSend(emails.criarMessageNovaSenha(destinatario, code));
    const result = await poller.pollUntilDone();
    return true
}

const enviarLoginUsuarioFamila = async function(destinatario, remetente, token) {
    const poller = await client.beginSend(emails.criarMessageLoginUsuarioFamilia(destinatario, remetente, token));
    const result = await poller.pollUntilDone();
    return true
}

module.exports = {
    enviarLoginUsuarioFamila,
    enviarNovaSenha
};
