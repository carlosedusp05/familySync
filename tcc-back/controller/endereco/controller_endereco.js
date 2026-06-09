/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de endereco
 * Autor: Gustavo de Paula Silva
 * Data: 06/05/2026
 * Versão: 1.0
 ************************************************/

const enderecoDAO = require("../../model/DAO/endereco.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

// GET ALL
const listarEndereco = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await enderecoDAO.getAllAddresses()
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

// GET BY ID
const listarEnderecoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarValorId(id)

    try {
        // Correção de bug lógico: alterado de !idValidado para idValidado
        if (idValidado) {
            let result = await enderecoDAO.getAddressById(id)

            if (result && result.length > 0) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = result[0]
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

// POST
const criarEndereco = async function (endereco, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = validarDados.validarDadosInformacao(endereco)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        // Correção da validação de dados
        if (dadosValidados == false)
            return dadosValidados

        let result = await enderecoDAO.setInsertAddress(endereco)
        
        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.SUCCESS_CREATED_ITEM.message
            return MESSAGE.HEADER
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

// PUT
const atualizarEndereco = async function (endereco, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = validarDados.validarDadosInformacao(endereco)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)
        let idValidado = validarAtributos.validarValorId(id)

        // Correção de bug lógico: anteriormente barrava se o ID FOSSE válido
        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (dadosValidados == false)
            return dadosValidados

        let buscarId = await enderecoDAO.getAddressById(id)
        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        endereco.id_endereco = parseInt(id)

        let result = await enderecoDAO.setUpdateAddress(endereco)

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
const excluirEndereco = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarValorId(id)

    try {
        // Correção de bug lógico: anteriormente barrava se o ID FOSSE válido
        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let buscarId = await enderecoDAO.getAddressById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await enderecoDAO.setDeleteAddress(id)

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
    listarEndereco,
    listarEnderecoID,
    criarEndereco,
    atualizarEndereco,
    excluirEndereco
}