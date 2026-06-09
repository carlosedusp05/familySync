/***********************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de financas
 * Autor: Kauan Antunes
 * Data: 05/05/2026
 * Versão: 1.0
 ************************************************/

const financasDAO = require("../../model/DAO/financas.js")
const mensagensDefault = require("../modulo/config_messages.js")
const validarDados = require("../modulo/validar_dados.js")
const validarAtributos = require("../modulo/validar_atributos.js")

//GET
const listarFinancas = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let result = await financasDAO.getAllFinances()

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

//GET ID
const listarFinancasID = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(id)

    try {
        if (idValidado) {
            let result = await financasDAO.getFinanceById(id)

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

//GET DIARIAS
const listarFinancasDiarias = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(idFamilia)

    try {
        if (idValidado) {
            let result = await financasDAO.getDailyFinances(idFamilia)

            if (result && result.financas && result.financas.length > 0) {
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

//GET SEMANAIS
const listarFinancasSemanais = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(idFamilia)

    try {
        if (idValidado) {
            let result = await financasDAO.getWeekFinances(idFamilia)

            if (result && result.financas && result.financas.length > 0) {
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

//GET MENSAIS
const listarFinancasMensais = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(idFamilia)

    try {
        if (idValidado) {
            let result = await financasDAO.getMonthFinances(idFamilia)

            if (result && result.financas && result.financas.length > 0) {
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

//GET ANUAIS
const listarFinancasAnuais = async function (idFamilia) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(idFamilia)

    try {
        if (idValidado) {
            let result = await financasDAO.getYearFinances(idFamilia)

            if (result && result.financas && result.financas.length > 0) {
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

// POST
const criarFinancas = async function (financas, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosFinancia(financas)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!dadosValidados)
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let result = await financasDAO.setInsertFinance(financas)

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
const atualizarFinancas = async function (financas, contentType, id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    try {
        let dadosValidados = await validarDados.validarDadosFinancia(financas)
        let contentTypeValidado = validarAtributos.validarContentType(contentType)
        let idValidado = validarAtributos.validarValorId(id)

        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        if (!contentTypeValidado)
            return MESSAGE.ERRO_CONTENT_TYPE

        if (!dadosValidados)
            return MESSAGE.ERRO_REQUIRED_FIELDS

        let buscarId = await financasDAO.getFinanceById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        financas.id_financas = parseInt(id)

        let result = await financasDAO.setUpdateFinance(financas)

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
const excluirFinancas = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(mensagensDefault))
    let idValidado = validarAtributos.validarId(id)

    try {
        if (!idValidado)
            return MESSAGE.ERRO_INVALID_ID

        let buscarId = await financasDAO.getFinanceById(id)

        if (!buscarId || buscarId.length === 0)
            return MESSAGE.ERRO_NOT_FOUND

        let result = await financasDAO.setDeleteFinance(id)

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
    listarFinancas,
    listarFinancasID,
    listarFinancasDiarias,
    listarFinancasSemanais,
    listarFinancasMensais,
    listarFinancasAnuais,
    criarFinancas,
    atualizarFinancas,
    excluirFinancas,
}