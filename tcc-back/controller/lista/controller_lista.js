/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação da camada model de familia
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/
const listaDAO = require("../../model/DAO/lista.js")
const mesagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

//GET
const listarListas = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let result = await listaDAO.getAllLists()
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
const listarListaID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = await validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let result = await listaDAO.getListById(id)
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
const listarListaCompletaPorFamilia = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let idValidado = validarAtributos.validarId(idFamilia)

        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let dados = await listaDAO.getAllItensListsByFamily(idFamilia)

        if (!dados || dados.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        const familia = {
            id_familia: dados[0].id_familia,
            nome_familia: dados[0].nome_familia,
            usuarios: []
        }

        dados.forEach(item => {
            let usuario = familia.usuarios.find(
                usuario => usuario.id_usuario === item.id_usuario
            )

            if (!usuario) {
                usuario = {
                    id_usuario: item.id_usuario,
                    nome_usuario: item.nome_usuario,
                    email: item.email,
                    is_admin: item.is_admin,
                    listas: []
                }

                familia.usuarios.push(usuario)
            }

            if (item.id_lista) {
                let lista = usuario.listas.find(
                    lista => lista.id_lista === item.id_lista
                )

                if (!lista) {
                    lista = {
                        id_lista: item.id_lista,
                        nome_lista: item.nome_lista,
                        favorita : item.favorita,
                        itens: []
                    }

                    usuario.listas.push(lista)
                }

                if (item.id_item) {
                    lista.itens.push({
                        id_lista: item.id_lista,
                        id_item: item.id_item,
                        nome_item: item.nome_item,
                        quantidade: item.quantidade,
                        valor_unitario: item.valor_unitario,
                        valor_total: item.valor_total,
                        comprado: item.comprado
                    })
                }
            }
        })

        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
        MESSAGE.HEADER.Response = familia

        return MESSAGE.HEADER

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
const listarListaFavoritaCompletaPorFamilia = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {
        let idValidado = validarAtributos.validarId(idFamilia)

        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let dados = await listaDAO.getFavoriteItensListsByFamily(idFamilia)

        if (!dados || dados.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        const familia = {
            id_familia: dados[0].id_familia,
            nome_familia: dados[0].nome_familia,
            usuarios: []
        }

        dados.forEach(item => {
            let usuario = familia.usuarios.find(
                usuario => usuario.id_usuario === item.id_usuario
            )

            if (!usuario) {
                usuario = {
                    id_usuario: item.id_usuario,
                    nome_usuario: item.nome_usuario,
                    email: item.email,
                    is_admin: item.is_admin,
                    listas: []
                }

                familia.usuarios.push(usuario)
            }

            if (item.id_lista) {
                let lista = usuario.listas.find(
                    lista => lista.id_lista === item.id_lista
                )

                if (!lista) {
                    lista = {
                        id_lista: item.id_lista,
                        nome_lista: item.nome_lista,
                        itens: []
                    }

                    usuario.listas.push(lista)
                }

                if (item.id_item) {
                    lista.itens.push({
                        id_item: item.id_item,
                        nome_item: item.nome_item,
                        quantidade: item.quantidade,
                        valor_unitario: item.valor_unitario,
                        valor_total: item.valor_total,
                        comprado: item.comprado
                    })
                }
            }
        })

        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_REQUEST.StatusCode
        MESSAGE.HEADER.Response = familia

        return MESSAGE.HEADER

    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
// POST
const criarLista = async function (lista, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosLista(lista)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    try {
        if (contentTypeValidado) {
            if (dadosValidados == true) {
                let result = await listaDAO.setInsertList(lista)
                let listaCriada = await listaDAO.getLastList()
                console.log(listaCriada)
                if (result) {
                    if (result.length > 0) {
                        MESSAGE.HEADER.StatusCode = MESSAGE.SUCCESS_CREATED_ITEM.StatusCode
                        if (!MESSAGE.HEADER.Response) MESSAGE.HEADER.Response = {}
                        MESSAGE.HEADER.Response.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.Response.lista = listaCriada[0][0]
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
const atulizarLista = async function (lista, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let dadosValidados = await validarDados.validarDadosLista(lista)
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    let idValidado = validarAtributos.validarValorId(id)
    try {

        if (idValidado) {
            let buscarId = await listaDAO.getListById(id)
            if (contentTypeValidado) {
                if (dadosValidados == true) {
                    if (buscarId) {
                        lista.id_lista = parseInt(id)
                        let result = await listaDAO.setUpdateList(lista)
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
const excluirLista = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let idValidado = await validarAtributos.validarValorId(id)
    try {
        if (idValidado) {
            let buscarId = await listaDAO.getListById(id)
            if (buscarId) {
                let result = await listaDAO.setDeleteList(id)

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

const favoritarLista = async function(id, favorita) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    try {

        let idValidado = validarAtributos.validarId(id)

        if(!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let result = await listaDAO.setFavoriteList(id, favorita)

        if(result){

            MESSAGE.HEADER.StatusCode = 200
            MESSAGE.HEADER.Response = "Favorito atualizado"

            return MESSAGE.HEADER

        }else{
            return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
        }

    } catch(error){
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
const favoritarListaLote = async function (listas, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mesagensDefault))
    let contentTypeValidado = await validarAtributos.validarContentType(contentType)
    try {
        if (contentTypeValidado == true) {
            listas.forEach(async lista => {
                let result = await listaDAO.setFavoriteList(lista.id_lista, lista.favorita)

                if (result) {

                    MESSAGE.HEADER.StatusCode = 200
                    MESSAGE.HEADER.Response = "Favorito atualizado"

                    return MESSAGE.HEADER

                } else {
                    return MESSAGE.ERRO_INTERNAL_SERVER_MODEL
                }
            });
        }


    } catch (error) {
        return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER
    }
}
module.exports = {
    listarListas,
    listarListaID,
    criarLista,
    atulizarLista,
    excluirLista,
    favoritarListaLote,
    listarListaCompletaPorFamilia,
    favoritarLista,
    listarListaFavoritaCompletaPorFamilia
}
