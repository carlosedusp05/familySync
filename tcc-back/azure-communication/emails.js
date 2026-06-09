/***********************************************
 * Objetivo: Arquivo de responsavel pela construção do email
 * Autor: Gustavo de Paula Silva
 * Data: 18/05/2026
 * Versão: 1.0
 ************************************************/

const html = require('./htmlsEmails')

const criarMessageNovaSenha = function(to_email, code){
    const message = {
        senderAddress:"DoNotReply@c1c84fa9-5816-4316-9edd-ff82e6600114.azurecomm.net",
        content:{
            subject: "Troca de senha de usuario",
            plainText: "Troca de senha de usuario",
            html:html.newPasswordHTML(code)
        },
        recipients: {
            to: [{ address: to_email }],
        },
    }
    return message
}
const criarMessageLoginUsuarioFamilia = function(to_email, remetente, token){
    const message = {
        senderAddress:"DoNotReply@c1c84fa9-5816-4316-9edd-ff82e6600114.azurecomm.net",
        content:{
            subject: `${remetente} quer adicionar você para a familia dele`,
            plainText: `${remetente} quer adicionar você para a familia dele`,
            html:html.joinFamilyHTML(to_email, remetente, token)
        },
        recipients: {
            to: [{ address: to_email }],
        },
    }
    return message
}
module.exports={
    criarMessageNovaSenha,
    criarMessageLoginUsuarioFamilia
}