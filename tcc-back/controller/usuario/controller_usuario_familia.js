/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada controller de informação
 * Autor: Kauan Antunes
 * Data: 11/05/2026
 * Versão: 1.0
 ************************************************/

const usuario_familiaDAO = require("../../model/DAO/usuario_familia.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
const enviarEmail = require("../login/controller_login.js")
const usuarioDAO = require('../../model/DAO/usuario.js')
const jwt = require('../../jwt/jwt_service.js')


//GET
const listarUsuarioFamilia = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await usuario_familiaDAO.getAllUsersFamily()

        if (result) {
            return {
                status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
                dados: result 
            }
        } else {
            return MESSAGE.ERRO_NOT_FOUND
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//GET ID
const listarUsuarioFamiliaID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        let result = await usuario_familiaDAO.getUsersFamilyById(id)

        if (result) {
            return {
                status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
                dados: result
            }
        } else {
            return MESSAGE.ERRO_NOT_FOUND
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//POST
const criarUsuarioFamilia = async function (usuarioFamilia, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioFamilia(usuarioFamilia))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let result = await usuario_familiaDAO.setInsertUsersFamily(usuarioFamilia)

        if (result) {
            return MESSAGE.SUCCESS_CREATED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//POST EMAIL (CONVITE)
const enviarEmailUsuarioFamiliaPorEmail = async function (usuarioFamilia, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioFamiliaPorEmail(usuarioFamilia))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let remetente = await usuario_familiaDAO.getUserAdmFamilyById(usuarioFamilia.id_familia)
        
        if (remetente && remetente !== "") {
            // Alterado de .forEach para for...of para tratar corretamente o fluxo de promises assíncronas
            for (const usuario of usuarioFamilia.email) {
                let emailValidado = await usuarioDAO.getUserByEmail(usuario)
                
                if (emailValidado === true) {
                    let objUser = {
                        "email": usuario,
                        "remetente": remetente[0].nome_usuario,
                    }
                    await enviarEmail.validarEntradoFamilia(objUser, contentType, usuarioFamilia.id_familia)
                }
            }
            return MESSAGE.SUCCESS_REQUEST
        } else {
            return MESSAGE.ERRO_ADM_NOT_FOUND
        }
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//POST TOKEN (CONFIRMAÇÃO)
const criarUsuarioFamiliaPorEmail = async function (token, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let usuario = jwt.getDecodedToken(token)
        
        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioFamiliaPorEmail(usuario))
            return MESSAGE.ERRO_REQUIRED_FIELDS
            
        let result = await usuario_familiaDAO.setInsertUsersFamilyByUserEmail(usuario)

        if (result == null) {
            return {
                status: 404,
                message: "Usuário não encontrado."
            }
        }

        if (result == "duplicado") {
            return {
                status: 409,
                message: "Usuário já pertence à família."
            }
        }

        if (result) {
            return MESSAGE.SUCCESS_CREATED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }
                    
    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//PUT
const atualizarUsuarioFamilia = async function (usuarioFamilia, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioFamilia(usuarioFamilia))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let buscarId = await usuario_familiaDAO.getUsersFamilyById(id)

        if (!buscarId)
            return MESSAGE.ERRO_NOT_FOUND

        usuarioFamilia.id_usuario_familia = parseInt(id)
        let result = await usuario_familiaDAO.setUpdateUsersFamily(usuarioFamilia)

        if (result) {
            return MESSAGE.SUCCESS_UPDATED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

//DELETE BY ID
const excluirUsuarioFamilia = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        let buscarId = await usuario_familiaDAO.getUsersFamilyById(id)

        if (!buscarId)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await usuario_familiaDAO.setDeleteUsersFamily(id)

        if (result) {
            return MESSAGE.SUCCESS_DELETED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirUsuarioFamiliaIdFamiliaIdUsuario = async function (id_familia, id_usuario) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let buscarId = await usuario_familiaDAO.getUserFamilyByIdUserIdFamily(id_familia, id_usuario)

        if (!buscarId)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await usuario_familiaDAO.setDeleteUserFamilyIdUserIdFamily(id_familia, id_usuario)

        if (result) {
            return MESSAGE.SUCCESS_DELETED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
module.exports = {
    listarUsuarioFamilia,
    listarUsuarioFamiliaID,
    criarUsuarioFamilia,
    criarUsuarioFamiliaPorEmail,
    atualizarUsuarioFamilia,
    excluirUsuarioFamilia,
    excluirUsuarioFamiliaIdFamiliaIdUsuario,
    enviarEmailUsuarioFamiliaPorEmail
}