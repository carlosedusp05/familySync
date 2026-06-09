/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de usuarios
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.0
 ************************************************/

const usuarioDAO = require("../../model/DAO/usuario.js")
const uploadDAO = require("../upload/upload_file.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
const jwt = require('../../jwt/jwt_service.js')
const bcrypt = require('bcryptjs');
const { json } = require("express")
const crypto = require('crypto');
// GET +
const listarUsuarios = async function () {
    // Cria a cópia local do objeto de mensagens
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    
    try {
        let result = await usuarioDAO.getAllUsers()
        if (result) {
            if (result.length > 0) {
                // console.log(result.length)
                // Alterado de mesagensDefault para MESSAGE
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

// GET id + 
const listarUsuarioID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let result = await usuarioDAO.getUserById(id)
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
        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
    }
}

const criarUsuario = async function (usuario, foto, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(usuario.senha, salt)
    try {
        let dadosValidados = await validarDados.validarDadosUsuario(usuario)
        let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
        let imagemEnvida = await uploadDAO.uploadFiles(foto)
        if (contentTypeValidado) {
            if (dadosValidados == true) {
                if(typeof(imagemEnvida) != false){
                    usuario.senha = hash
                    usuario.foto = imagemEnvida
                    let result = await usuarioDAO.setInsertUser(usuario)
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
                }else{
                    MESSAGE.HEADER.Response = MESSAGE.ERRO_REQUIRED_FIELDS
                    return MESSAGE.HEADER
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

const atulizarUsuario = async function (usuario, foto, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosUsuario(usuario)
        let contentTypeValidado = validarAtributos.validarContentTypeFormData(contentType)
        let idValidado = validarAtributos.validarValorId(id)
        let imagemEnvida = await uploadDAO.uploadFiles(foto)
        if (idValidado) {
            let buscarId = usuarioDAO.getUserById(id)
            if (contentTypeValidado) {
                if (dadosValidados == true) {
                    if (buscarId) {
                        if(typeof(imagemEnvida) != false){
                            usuario.id_usuario = parseInt(id)
                            usuario.foto = imagemEnvida
                            let result = await usuarioDAO.setUpdateUser(usuario)
                            if (result) {
                                if (result.length > 0) {
                                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
                                    MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
                                    return MESSAGE.HEADER
                                } else {
                                    return MESSAGE.ERRO_NOT_FOUND
                                }
                            } else {
                                return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                            }
                        }else{
                            MESSAGE.HEADER.Response = MESSAGE.ERRO_REQUIRED_FIELDS
                            return MESSAGE.HEADER
                        }
                    } else {
                        return MESSAGE.ERRO_INVALID_ID
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

const atulizarSenhaUsuarioCadastrado = async function(usuario, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(usuario.senhaNova, salt); 
    let emailValidado = await usuarioDAO.getUserByEmail(usuario.email)
    let contentTypeValidado = validarAtributos.validarContentType(contentType)
    try {
        if(emailValidado == true){
            let senhaAntiga = await usuarioDAO.getUserPasswordByEmail(usuario.email)
            let senhaComparada = bcrypt.compareSync(usuario.senhaAtual, senhaAntiga[0][0].senha)
            if(senhaComparada == true){
                let obj = {
                    "senha": hash,
                    "email": usuario.email
                }
                let result = await usuarioDAO.setUpdadeUserPasswordByEmail(obj)
                if(result == true){
                    MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
                    MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
                    return MESSAGE.HEADER
                }else{
                    return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                }
            }else{
                return MESSAGE.ERRO_NOT_FOUND
            }
        }else{
            return MESSAGE.ERRO_NOT_FOUND
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const atulizarSenhaUsuario = async function(usuario, token, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(usuario.senha, salt); 
    let codeParametro = jwt.getDecodedToken(token)
    let emailValidado = await usuarioDAO.getUserByEmail(codeParametro.email)
    let contentTypeValidado = validarAtributos.validarContentType(contentType)
    try {
        if(emailValidado == true){
            if(codeParametro.code == usuario.code){
                if(contentTypeValidado){
                    usuario.senha = hash
                    let result = await usuarioDAO.setUpdadeUserPasswordByEmail(usuario, codeParametro.email)
                    if(result == true){
                        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_UPDATED_ITEM.StatusCode
                        MESSAGE.HEADER.Response = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return contentTypeValidado
                }
            }else{
                return false
            }
        }else{
            return MESSAGE.ERRO_NOT_FOUND
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuario = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let buscarId = await usuarioDAO.getUserById(id)
            if (buscarId) {
                let result = await usuarioDAO.setDeleteUser(id)
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
    listarUsuarioID,
    listarUsuarios,
    excluirUsuario,
    atulizarUsuario,
    criarUsuario,
    atulizarSenhaUsuarioCadastrado,
    atulizarSenhaUsuario
}
