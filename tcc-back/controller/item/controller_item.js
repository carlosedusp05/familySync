/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de familia
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/
const itemDAO = require("../../model/DAO/item.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

//GET
const listarItens = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await itemDAO.getAllItens()
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

//GET id
const listarItemID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarId(id)
    try {
        if (idValidado) {
            let result = await itemDAO.getItenById(id)
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
const criarItem = async function (item, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosItens(item)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)

    try {
        if (contentTypeValidado) {
            if (dadosValidados == true) {

                let itemCriado = await itemDAO.setInsertIten(item)

                if (itemCriado) {
                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                    MESSAGE.HEADER.Response = itemCriado
                    return MESSAGE.HEADER
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

const editarItemLote = async function (items, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)

    items.forEach(async item => {
        if (contentTypeValidado) {
            console.log(item)

            let result = await itemDAO.setUpdateItenStatus(item)

            if (result) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                MESSAGE.HEADER.Response = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
            }

        } else {
            return MESSAGE.ERRO_CONTENT_TYPE
        }
    });
}

// PUT
const atulizarItem = async function (item, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosItens(item)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    let idValidado = validarAtributos.validarId(id)

    try {
        if (idValidado) {
            let buscarId = await itemDAO.getItenById(id)
            if (contentTypeValidado) {
                if (dadosValidados == true) {
                    if (buscarId) {
                        item.id_item = parseInt(id)
                        let result = await itemDAO.setUpdateIten(item)
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
const excluirItem = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarId(id)
    try {
        if (idValidado) {
            let buscarId = await itemDAO.getItenById(id)
            if (buscarId) {
                let result = await itemDAO.setDeleteIten(id)
                if (result) {
                    if (result.length > 0) {
                        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_DELETED_ITEM.StatusCode
                        MESSAGE.HEADER.Response = MESSAGE.SUCCESS_DELETED_ITEM.message
                        return MESSAGE.HEADER
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
    listarItemID,
    listarItens,
    criarItem,
    editarItemLote, 
    atulizarItem,
    excluirItem
}
