/***********************************************
 * Objetivo: Controller usuario_notificacao
 * Autor: Kauan Antunes
 * Data: 11/05/2026
 * Versão: 1.1
 ************************************************/

const usuario_notificacaoDAO = require("../../model/DAO/usuario_notificacao.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")


// GET ALL
const listarUsuarioNotificacao = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await usuario_notificacaoDAO.getAllUsersNotification()

        if (result && result.length > 0) {
            return {
                status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
                dados: result
            }
        }

        return MESSAGE.ERRO_NOT_FOUND

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}


// GET POR ID
const listarUsuarioNotificacaoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        let result = await usuario_notificacaoDAO.getUsersNotificationById(id)

        if (result) {
            return {
                status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
                dados: result
            }
        }

        return MESSAGE.ERRO_NOT_FOUND

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}


// CREATE
const criarUsuarioNotificacao = async function (usuarioNotificacao, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioNotificacao(usuarioNotificacao))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let result = await usuario_notificacaoDAO.setInsertUsersNotification(usuarioNotificacao)

        if (result) {
            return MESSAGE.SUCCESS_CREATED_ITEM
        }

        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}


// UPDATE
const atualizarUsuarioNotificacao = async function (usuarioNotificacao, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioNotificacao(usuarioNotificacao))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let buscarId = await usuario_notificacaoDAO.getUsersNotificationById(id)

        if (!buscarId)
            return MESSAGE.ERRO_NOT_FOUND

        usuarioNotificacao.id_usuario_notificacao = parseInt(id)

        let result = await usuario_notificacaoDAO.setUpdateUsersNotification(usuarioNotificacao)

        if (result) {
            return MESSAGE.SUCCESS_UPDATED_ITEM
        }

        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}


// DELETE
const excluirUsuarioNotificacao = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        let buscarId = await usuario_notificacaoDAO.getUsersNotificationById(id)

        if (!buscarId)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await usuario_notificacaoDAO.setDeleteUsersNotification(id)

        if (result) {
            return MESSAGE.SUCCESS_DELETED_ITEM
        }

        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
module.exports = {
    listarUsuarioNotificacao,
    listarUsuarioNotificacaoID,
    criarUsuarioNotificacao,
    atualizarUsuarioNotificacao,
    excluirUsuarioNotificacao
}