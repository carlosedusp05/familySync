/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Kauan Antunes
 * Data: 06/05/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");


const knexDatabase = knex(knexConfig.development);

// Função auxiliar para retornar família + array de finanças
const getFamiliaComFinancas = async function(idFamilia, view, orderBy = "") {
    try {
        let sqlFamilia = `
            SELECT
                id_familia,
                nome,
                telefone_residencial,
                foto
            FROM tb_familia
            WHERE id_familia = ${idFamilia}
        `

        let resultFamilia = await knexDatabase.raw(sqlFamilia)

        let familia = resultFamilia[0][0]

        if (!familia) {
            return false
        }

        let sqlFinancas = `
            SELECT *
            FROM ${view}
            WHERE id_familia = ${idFamilia}
            ${orderBy}
        `

        let resultFinancas = await knexDatabase.raw(sqlFinancas)

        familia.financas = resultFinancas[0]

        return familia

    } catch (error) {
        return error
    }
}

//GET 
const getAllFinances = async function() {
    try {
        let sql = `SELECT * FROM tb_financas`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        return error
    }
}

//GET por id
const getFinanceById = async function(id) {
    try {
        let sql = `SELECT * FROM tb_financas WHERE id_financas = ${id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        return error
    }
}

//GET Financas por dia
const getDailyFinances = async function(idFamilia) {
    return await getFamiliaComFinancas(
        idFamilia,
        "vw_financas_diarias",
        "ORDER BY data_movimentacao"
    )
}

//GET Financas por semana
const getWeekFinances = async function(idFamilia) {
    return await getFamiliaComFinancas(
        idFamilia,
        "vw_financas_semanais",
        ""
    )
}

//GET Financas por mes
const getMonthFinances = async function(idFamilia) {
    return await getFamiliaComFinancas(
        idFamilia,
        "vw_financas_mensais",
        "ORDER BY ano, mes"
    )
}

//GET Financas por ano
const getYearFinances = async function(idFamilia) {
    return await getFamiliaComFinancas(
        idFamilia,
        "vw_financas_anuais",
        ""
    )
}

//POST
const setInsertFinance = async function(financas) {
    try {
        let sql = `
            INSERT INTO tb_financas (
                id_familia,
                tipo,
                descricao,
                valor,
                icone
            ) VALUES (
                ${financas.id_familia},
                '${financas.tipo}',
                '${financas.descricao}',
                ${financas.valor},
                '${financas.icone}'
            )
        `

        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        return error
    }
}

//PUT
const setUpdateFinance = async function(financas) {
    try {
        let sql = `
            UPDATE tb_financas SET
                tipo = '${financas.tipo}',
                descricao = '${financas.descricao}',
                valor = ${financas.valor},
                icone = '${financas.icone}'
            WHERE id_financas = ${financas.id_financas}
        `

        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        return error
    }
}

//DELETE
const setDeleteFinance = async function(id) {
    try {
        let sql = `DELETE FROM tb_financas WHERE id_financas = ${id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        return error
    }
}

module.exports = {
    getAllFinances,
    getFinanceById,
    getDailyFinances,
    getWeekFinances,
    getMonthFinances,
    getYearFinances,
    setInsertFinance,
    setUpdateFinance,
    setDeleteFinance
}