/***********************************************
 * Objetivo: Arquivo de responsável pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva, Kauan Antunes lima
 * Data: 27/04/2026
 * Versão: 1.3
 ************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");

const knexDatabase = knex(knexConfig.development);

// GET
const getAllInformations = async function () {
    try {

        let sql = `
            SELECT
                i.*,
                ui.id_usuario
            FROM tb_informacao i
            INNER JOIN tb_usuario_informacao ui
                ON i.id_info = ui.id_info
        `

        let result = await knexDatabase.raw(sql)

        return result[0]

    } catch (error) {
        return false
    }
}

// GET por ID
const getInformationById = async function (id) {
    try {

        let sql = `
            SELECT
                i.*,
                ui.id_usuario
            FROM tb_informacao i
            INNER JOIN tb_usuario_informacao ui
                ON i.id_info = ui.id_info
            WHERE i.id_info = ?
        `

        let result = await knexDatabase.raw(sql, [id])

        return result[0]

    } catch (error) {
        return false
    }
}

// POST
const setInsertInformation = async function (informacao) {
    try {

        let sql = `
            INSERT INTO tb_informacao (
                titulo,
                descricao
            ) VALUES (
                ?,
                ?
            )
        `

        let result = await knexDatabase.raw(sql, [
            informacao.titulo,
            informacao.descricao
        ])

        return result[0].insertId

    } catch (error) {
        return false
    }
}

// PUT
const setUpdateInformation = async function (informacao) {
    try {

        let sql = `
            UPDATE tb_informacao SET
                titulo = ?,
                descricao = ?
            WHERE id_info = ?
        `

        let result = await knexDatabase.raw(sql, [
            informacao.titulo,
            informacao.descricao,
            informacao.id_info
        ])

        return !!result

    } catch (error) {
        return false
    }
}

// DELETE
const setDeleteInformation = async function (id) {
    try {

        let sql = `
            DELETE FROM tb_informacao
            WHERE id_info = ?
        `

        let result = await knexDatabase.raw(sql, [id])

        return !!result

    } catch (error) {
        return false
    }
}

module.exports = {
    getAllInformations,
    getInformationById,
    setInsertInformation,
    setUpdateInformation,
    setDeleteInformation
}