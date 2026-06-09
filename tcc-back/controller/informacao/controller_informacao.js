/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de informacao
 * Autor: Kauan Antunes
 * Data: 05/05/2026
 * Versão: 1.0
 ************************************************/

const informacaoDAO = require("../../model/DAO/informacao.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

//GET
const listarInformacao = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await informacaoDAO.getAllInformations()

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
 
//GET ID
const listarInformacaoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarValorId(id)

    try {
        if (idValidado) {
            let result = await informacaoDAO.getInformationById(id)

            if (result && result.length > 0) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = result
                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERRO_NOT_FOUND
            }

        } else {
            return MESSAGE.ERRO_INVALID_ID
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//POST
const criarInformacao = async function (informacao, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {

        let dadosValidados = await validarDados.validarDadosInformacao(informacao)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!dadosValidados)
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let idInfo = await informacaoDAO.setInsertInformation(informacao)

        if (!idInfo)
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

        let usuarioInformacao = {
            id_usuario: informacao.id_usuario,
            id_info: idInfo
        }

        let vinculo = await informacaoDAO.setInsertInformation(informacao)

        if (!vinculo)
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
        MESSAGE.HEADER.Response = {
            message: MESSAGE.SUCCESS_CREATED_ITEM.message,
            id_info: idInfo,
            id_usuario: informacao.id_usuario
        }

        return MESSAGE.HEADER

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//PUT
const atualizarInformacao = async function (informacao, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = validarDados.validarDadosInformacao(informacao)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)
        let idValidado = validarAtributos.validarValorId(id)

        if (idValidado == false)
            return MESSAGE.ERRO_INVALID_ID

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (dadosValidados == false)
            return dadosValidados
        let buscarId = await informacaoDAO.getInformationById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        informacao.id_info = parseInt(id)

        let result = await informacaoDAO.setUpdateInformation(informacao)

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

//DELETE
const excluirInformacao = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarValorId(id)

    try {
        // Correção de bug lógico: anteriormente retornava erro se o ID fosse válido (!idValidado invertido)
        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let buscarId = await informacaoDAO.getInformationById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await informacaoDAO.setDeleteInformation(id)

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
    listarInformacao,
    listarInformacaoID,
    criarInformacao,
    atualizarInformacao,
    excluirInformacao,
}