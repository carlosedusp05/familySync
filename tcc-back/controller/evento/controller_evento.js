/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de evento
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.1
 ************************************************/

const eventoDAO = require("../../model/DAO/eventos.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
// GET ALL
const listarEventos = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await eventoDAO.getAllEvents()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = result
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

// GET BY ID
const listarEventoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarValorId(id)

    try {
        if (!idValidado) {
            return MESSAGE.ERRO_INVALID_ID
        }

        let result = await eventoDAO.getEventById(id)

        if (result && result.length > 0) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
            MESSAGE.HEADER.Response = result[0]
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_NOT_FOUND
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const listarEventosFamilia = async function(idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(idFamilia)

    try {
        if (!idValidado) {
            return MESSAGE.ERRO_INVALID_ID
        }

        let result = await eventoDAO.getEventsByFamily(idFamilia)

        if (result && result.length > 0) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
            MESSAGE.HEADER.Response = result
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_NOT_FOUND
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// POST
const criarEvento = async function (evento, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosEvento(evento)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)

        if (!contentTypeValidado) {
            return MESSAGE.ERRO_CONTENT_TYPE
        }

        if (!dadosValidados) {
            return MESSAGE.ERRO_REQUIRED_FIELDS
        }

        let result = await eventoDAO.setInsertEvent(evento)

        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
            MESSAGE.HEADER.Response = {
                message: MESSAGE.SUCCESS_CREATED_ITEM.message,
                id_evento: result
            }
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// PUT
const atualizarEvento = async function (evento, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosEvento(evento)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)
        let idValidado = validarAtributos.validarId(id)

        if (!idValidado) {
            return MESSAGE.ERRO_INVALID_ID
        }

        if (!contentTypeValidado) {
            return MESSAGE.ERRO_CONTENT_TYPE
        }

        if (!dadosValidados) {
            return MESSAGE.ERRO_REQUIRED_FIELDS
        }

        let buscarId = await eventoDAO.getEventById(id)

        if (!buscarId || buscarId.length === 0) {
            return MESSAGE.ERRO_NOT_FOUND
        }

        evento.id_evento = parseInt(id)

        let result = await eventoDAO.setUpdateEvent(evento)

        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// DELETE
const excluirEvento = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(id)

    try {
        if (!idValidado) {
            return MESSAGE.ERRO_INVALID_ID
        }

        let buscarId = await eventoDAO.getEventById(id)

        if (!buscarId || buscarId.length === 0) {
            return MESSAGE.ERRO_NOT_FOUND
        }

        let result = await eventoDAO.setDeleteEvent(id)

        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_DELETED_ITEM.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.SUCCESS_DELETED_ITEM.message
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarEventos,
    listarEventoID,
    listarEventosFamilia,
    criarEvento,
    atualizarEvento,
    excluirEvento
}