/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de familia
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.0
 ************************************************/
const familiaDAO = require("../../model/DAO/familia.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
const uploadDAO = require("../upload/upload_file.js")
//GET
const listarFamilias = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await familiaDAO.getAllFamilys()
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
const listarFamiliaID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarId(id)
    try {
        if (idValidado) {
            let result = await familiaDAO.getFamilyById(id)
            if (result) {
                MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
                MESSAGE.HEADER.Response = result
                return MESSAGE.HEADER
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

const listarFamiliaCompleta = async function(id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await familiaDAO.getFamilyComplete(id)

        if(result){
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
            MESSAGE.HEADER.Response = result
            return MESSAGE.HEADER
        }else{
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//POST
const criarFamilia = async function (familia, foto, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosFamilia(familia)
        let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
        if (contentTypeValidado) {
            if (dadosValidados == true) {
                let imagemEnvida = await uploadDAO.uploadFiles(foto)
                if(imagemEnvida !== false){
                    familia.foto = imagemEnvida
                    let result = await familiaDAO.setInsertFamily(familia)
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

// POST PROCEDURE
const criarFamiliaEndereco = async function(familia, foto, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosFamiliaEndereco(familia)
    console.log(dadosValidados)
    let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
    let imagemEnvida = await uploadDAO.uploadFiles(foto)
    try {
        if(contentTypeValidado){
            if(dadosValidados == true){
                familia.foto = imagemEnvida
                let result = await familiaDAO.setInsertFamilyAddress(familia)
                if(result){
                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                    MESSAGE.HEADER.Response = MESSAGE.SUCCESS_CREATED_ITEM.message
                    return MESSAGE.HEADER
                }else{
                    return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                }
            }else{
                return MESSAGE.ERRO_REQUIRED_FIELDS
            }
        }else{
            return MESSAGE.ERRO_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//PUT
const atulizarFamilia = async function (familia, foto, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosFamilia(familia)
    let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
    let idValidado = validarAtributos.validarValorId(id)
    
    try {
        if (idValidado) {
            // Correção de bug síncrono: adicionado o await que faltava na busca
            let buscarId = await familiaDAO.getFamilyById(id)
            if (contentTypeValidado) {
                if (dadosValidados == true) {
                    if (buscarId && buscarId.length !== 0) {
                        let imagemEnvida = await uploadDAO.uploadFiles(foto)
                        if(imagemEnvida !== false){
                            familia.id_familia = parseInt(id)
                            familia.foto = imagemEnvida
                            let result = await familiaDAO.setUpdateFamily(familia)
                            if (result) {
                                if (result.length > 0) {
                                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
                                    MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
                                    return MESSAGE.HEADER
                                }
                            } else {
                                return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                            }
                        }
                    } else {
                        return MESSAGE.ERRO_NOT_FOUND
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

const atualizarFamiliaEndereco = async function (familia, foto, contentType, id) {
    try {
        let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
        let imagemEnvida = await uploadDAO.uploadFiles(foto)
        let dadosValidados = await validarDados.validarDadosFamiliaEndereco(familia)
        let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
        let idValidado = validarAtributos.validarId(id)

        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!dadosValidados)
            return MESSAGE.ERRO_REQUIRED_FIELDS

        familia.id_familia = parseInt(id)
        familia.foto = imagemEnvida
        let result = await familiaDAO.setUpdateFamilyAddress(familia)

        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
            return MESSAGE.HEADER
        }

        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//DELETE
const excluirFamilia = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarId(id)
    try {
        if (idValidado) {
            let buscarId = await familiaDAO.getFamilyById(id)
            if (buscarId && buscarId.length !== 0) {
                let result = await familiaDAO.setDeleteFamily(id)
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
                return MESSAGE.ERRO_NOT_FOUND
            }
        } else {
            return MESSAGE.ERRO_INVALID_ID
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirFamiliaEndereco = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let idValidado = validarAtributos.validarId(id)

        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let result = await familiaDAO.setDeleteFamilyAddress(id)

        if (result) {
            MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_DELETED_ITEM.StatusCode
            MESSAGE.HEADER.Response = MESSAGE.SUCCESS_DELETED_ITEM.message
            return MESSAGE.HEADER
        }

        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
module.exports = {
    listarFamiliaID,
    listarFamilias,
    listarFamiliaCompleta,
    criarFamilia,
    criarFamiliaEndereco,
    atulizarFamilia,
    atualizarFamiliaEndereco,
    excluirFamilia,
    excluirFamiliaEndereco
}