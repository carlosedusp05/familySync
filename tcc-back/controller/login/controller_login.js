/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de usuarios
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.0
 ************************************************/

const loginDAO = require("../../model/DAO/login.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
const bcrypt = require('bcryptjs');
const crypto = require("crypto")
const jwt = require('../../jwt/jwt_service.js')
const emails = require('../../azure-communication/enviarEmails.js')

const validarLogin = async function(login, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await loginDAO.getAutentication(login.email)  
        let senhaComparada = bcrypt.compareSync(login.senha, result[0][0].senha); 
        if(senhaComparada == true){
            if (result && result.length > 0) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Status = senhaComparada
                MESSAGE.HEADER.Response = result[0][0]
                
                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERRO_NOT_FOUND
            }
        }else{
            return MESSAGE.ERRO_INVALID_PASSWORD
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }    
}

const criarCodigoSenha = function() {
    const codigo = crypto.randomInt(0, 1000000);
    const result = codigo.toString().padStart(6, '0');
    return result
}

const validarTrocaSenha = async function (email, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let code = criarCodigoSenha()
    let obj ={
        "code": code,
        "email": email
    }
    let tokenCode = jwt.getToken(obj)
    try {
        let emailEnvidado = await emails.enviarNovaSenha(email, code)
        if(emailEnvidado == true){
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
            MESSAGE.HEADER.Response = tokenCode
            return MESSAGE.HEADER
        }else{
            MESSAGE.HEADER.StatusCode = MESSAGE.ERRO_RELATION_TABLE.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.ERRO_RELATION_TABLE.message

            return MESSAGE.HEADER
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }  
}

const validarEntradoFamilia = async function (email, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let contentTypeValidado = validarAtributos.validarContentType(contentType)
    try {
        if(contentTypeValidado){
            let objToken = {"email": email.email, "id_familia":id}
            let token = jwt.getToken(objToken)
            let emailEnvidado = await emails.enviarLoginUsuarioFamila(email.email, email.remetente, token)
            if(emailEnvidado == true){
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = MESSAGE.SUCCESS_REQUEST.message
                return MESSAGE.HEADER
            }else{
                MESSAGE.HEADER.StatusCode = MESSAGE.ERRO_RELATION_TABLE.StatusCode
                MESSAGE.HEADER.Response = MESSAGE.ERRO_RELATION_TABLE.message

                return MESSAGE.HEADER
            }
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }  
}
module.exports = {
    validarLogin,
    validarTrocaSenha,
    validarEntradoFamilia
}
