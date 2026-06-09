/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de usuarios
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.0
 ************************************************/

const notificacaoDAO = require("../../model/DAO/notificacao.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

// GET
const listarNotificacoes = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await notificacaoDAO.getAllNotifications()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = result[0]
                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERRO_NOT_FOUND
            }
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// GET id
const listarNotificacaoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let result = await notificacaoDAO.getNotificationById(id)
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                    MESSAGE.HEADER.Response = result[0]
                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERRO_NOT_FOUND
                }
            } else {
                return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
            }
        } else {
            return MESSAGE.ERRO_INVALID_ID
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// POST
const criarNotificacao = async function (notificacao, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosNotificacao(notificacao)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    try {
        if (contentTypeValidado) {
            if (dadosValidados == true) {
                let result = await notificacaoDAO.setInsertNotification(notificacao)
                if (result) {
                    if (result.length > 0) {
                        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                        MESSAGE.HEADER.Response = MESSAGE.SUCCESS_CREATED_ITEM.message
                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERRO_NOT_FOUND
                    }
                } else {
                    return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                }
            } else {
                return dadosValidados
            }
        } else {
            return MESSAGE.ERRO_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// PUT
const atulizarNotificacao = async function (notificacao, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosNotificacao(notificacao)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    let idValidado = validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let buscarId = notificacaoDAO.getNotificationById(id)
            if (contentTypeValidado) {
                if (dadosValidados == true) {
                    if (buscarId) {
                        notificacao.id_notificacao = parseInt(id)
                        let result = await notificacaoDAO.setUpdateNotification(notificacao)
                        console.log(result)
                        if (result) {
                            if (result.length > 0) {
                                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
                                MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
                                return MESSAGE.HEADER
                            }
                        } else {
                            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                        }
                    } else {
                        return buscarId
                    }
                } else {
                    return dadosValidados
                }
            } else {
                return MESSAGE.ERRO_CONTENT_TYPE
            }
        } else {
            return MESSAGE.ERRO_INVALID_ID
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// DELETE
const excluirNotificacao = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = await validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let buscarId = await notificacaoDAO.getNotificationById(id)
            if (buscarId) {
                let result = await notificacaoDAO.setDeleteNotification(id)
                console.log(result)
                if (result) {
                    if (result.length > 0) {
                        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_DELETED_ITEM.StatusCode
                        MESSAGE.HEADER.Response = MESSAGE.SUCCESS_DELETED_ITEM.message
                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERRO_NOT_FOUND
                    }
                } else {
                    return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                }
            } else {
                return buscarId
            }
        } else {
            return MESSAGE.ERRO_INVALID_ID
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
module.exports = {
    listarNotificacoes,
    listarNotificacaoID,
    criarNotificacao,
    atulizarNotificacao,
    excluirNotificacao
}