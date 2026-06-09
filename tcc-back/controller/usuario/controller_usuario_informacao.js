/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada controller de informação
 * Autor: Kauan Antunes
 * Data: 07/05/2026
 * Versão: 1.2
 ************************************************/

const usuario_informacaoDAO = require("../../model/DAO/usuario_informacao.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")
const listarUsuarioInformacao = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await usuario_informacaoDAO.getAllUsersInformation()

        if (result && result.length > 0) {
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

const listarUsuarioInformacaoPorFamilias = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dados = await usuario_informacaoDAO.getAllUsersInformationByFamilies();

        if (!dados || dados.length === 0)
            return MESSAGE.ERRO_NOT_FOUND;

        const familias = [];

        dados.forEach(item => {

            let familia = familias.find(f => f.id_familia === item.id_familia);

            if (!familia) {
                familia = {
                    id_familia: item.id_familia,
                    nome_familia: item.nome_familia,
                    usuarios: []
                };

                familias.push(familia);
            }

            let usuario = familia.usuarios.find(u => u.id_usuario === item.id_usuario);

            if (!usuario) {
                usuario = {
                    id_usuario: item.id_usuario,
                    nome_usuario: item.nome_usuario,
                    email: item.email,
                    is_admin: item.is_admin,
                    informacoes: []
                };

                familia.usuarios.push(usuario);
            }

            if (item.id_info) {
                usuario.informacoes.push({
                    id_usuario_informacao: item.id_usuario_informacao,
                    id_info: item.id_info,
                    titulo: item.titulo,
                    descricao: item.descricao_informacao
                });
            }
        });

        return {
            status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
            dados: familias
        };

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER;
    }
};

const listarUsuarioInformacaoPorFamilia = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(idFamilia))
            return MESSAGE.ERRO_INVALID_ID

        let dados = await usuario_informacaoDAO.getUsersInformationByFamily(idFamilia)

        if (!dados || dados.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        const familia = {
            id_familia: dados[0].id_familia,
            nome_familia: dados[0].nome_familia,
            usuarios: []
        }

        dados.forEach(item => {
            let usuario = familia.usuarios.find(u => u.id_usuario === item.id_usuario)

            if (!usuario) {
                usuario = {
                    id_usuario: item.id_usuario,
                    nome_usuario: item.nome_usuario,
                    email: item.email,
                    is_admin: item.is_admin,
                    informacoes: []
                }

                familia.usuarios.push(usuario)
            }

            if (item.id_info) {
                usuario.informacoes.push({
                    id_usuario_informacao: item.id_usuario_informacao,
                    id_info: item.id_info,
                    titulo: item.titulo,
                    descricao: item.descricao_informacao
                })
            }
        })

        return {
            status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
            dados: familia
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const listarUsuarioInformacaoID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        let result = await usuario_informacaoDAO.getUsersInformationById(id)
        
        if (result && result.length > 0) {
            return {
                status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
                dados: result[0]
            }
        } else {
            return MESSAGE.ERRO_NOT_FOUND
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const listarUsuarioInformacaoPorUsuario = async function (idUsuario) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {

        if (!validarAtributos.validarId(idUsuario))
            return MESSAGE.ERRO_INVALID_ID

        let dados =
            await usuario_informacaoDAO.getUsersInformationByUser(idUsuario)

        if (!dados || dados.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        const usuario = {
            id_usuario: dados[0].id_usuario,
            nome_usuario: dados[0].nome_usuario,
            informacoes: []
        }

        dados.forEach(item => {
            usuario.informacoes.push({
                id_info: item.id_info,
                titulo: item.titulo,
                descricao: item.descricao_informacao
            })
        })

        return {
            status_code: MESSAGE.SUCCESS_REQUEST.StatusCode,
            dados: usuario
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const criarUsuarioInformacao = async function (usuarioInformacao, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioInformacao(usuarioInformacao))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let result = await usuario_informacaoDAO.setInsertUsersInformation(usuarioInformacao)

        if (result) {
            return MESSAGE.SUCCESS_CREATED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarUsuarioInformacao = async function (usuarioInformacao, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id))
            return MESSAGE.ERRO_INVALID_ID

        if (!validarAtributos.validarContentType(contentType))
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!validarDados.validarUsuarioInformacao(usuarioInformacao))
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let buscarId = await usuario_informacaoDAO.getUsersInformationById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        usuarioInformacao.id_usuario_informacao = parseInt(id)

        let result = await usuario_informacaoDAO.setUpdateUsersInformation(usuarioInformacao)

        if (result) {
            return MESSAGE.SUCCESS_UPDATED_ITEM
        } else {
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuarioInformacao = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        if (!validarAtributos.validarId(id)) {
            return MESSAGE.ERRO_INVALID_ID
        }

        let buscarId = await usuario_informacaoDAO.getUsersInformationById(id)

        if (!buscarId || buscarId.length === 0) {
            return MESSAGE.ERRO_NOT_FOUND
        }

        let result = await usuario_informacaoDAO.setDeleteUsersInformation(id)

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
    listarUsuarioInformacao,
    listarUsuarioInformacaoPorFamilias,
    listarUsuarioInformacaoPorFamilia,
    listarUsuarioInformacaoID,
    listarUsuarioInformacaoPorUsuario,
    criarUsuarioInformacao,
    atualizarUsuarioInformacao,
    excluirUsuarioInformacao
}