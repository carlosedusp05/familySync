/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Kauan Antunes
 * Data: 07/05/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");

const knexDatabase = knex(knexConfig.development);


// GET 
const getAllUsersInformation = async function () {
    try {
        let sql = `SELECT * FROM vw_usuario_informacao`   
        let result = await knexDatabase.raw(sql)

        return result[0] 

    } catch (error) {
        return false
    }
}

// GET BY ID
const getUsersInformationById = async function (id) {
    try {
        let sql = `  SELECT * FROM vw_usuario_informacao WHERE id_usuario_informacao = ?`
        let result = await knexDatabase.raw(sql, [id])

        return result[0]
    } catch (error) {
        return false
    }
}

const getUsersInformationByUser = async function (idUsuario) {
    try {

        let sql = `
            SELECT *
            FROM vw_usuario_informacao
            WHERE id_usuario = ?
        `

        let result = await knexDatabase.raw(sql, [idUsuario])

        return result[0]

    } catch (error) {
        return false
    }
}

const getAllUsersInformationByFamilies = async function () {
    try {
        let sql = `
            SELECT *
            FROM vw_usuario_informacao
            ORDER BY id_familia, id_usuario, id_info
        `

        let result = await knexDatabase.raw(sql)

        return result[0]

    } catch (error) {
        return false
    }
}

const getUsersInformationByFamily = async function (idFamilia) {
    try {
        let sql = `
            SELECT *
            FROM vw_usuario_informacao
            WHERE id_familia = ?
            ORDER BY id_usuario, id_info
        `

        let result = await knexDatabase.raw(sql, [idFamilia])

        return result[0]

    } catch (error) {
        return false
    }
}

// POST
const setInsertUsersInformation = async function (usuarioInformacao) {
    try {
        let sql = `
            INSERT INTO tb_usuario_informacao (
                id_usuario,
                id_familia,
                id_info
            ) VALUES (?, ?, ?)
        `

        let result = await knexDatabase.raw(sql, [
            usuarioInformacao.id_usuario,
            usuarioInformacao.id_familia,
            usuarioInformacao.id_info
        ])

        return result[0].affectedRows > 0

    } catch (error) {
        console.log(error)
        return false
    }
}

// PUT
const setUpdateUsersInformation = async function (usuarioInformacao) {
    try {
        let sql = `
            UPDATE tb_usuario_informacao SET
                id_usuario = ?,
                id_familia = ?,
                id_info = ?
            WHERE id_usuario_informacao = ?
        `

        let result = await knexDatabase.raw(sql, [
            usuarioInformacao.id_usuario,
            usuarioInformacao.id_familia,
            usuarioInformacao.id_info,
            usuarioInformacao.id_usuario_informacao
        ])

        return result[0].affectedRows > 0

    } catch (error) {
        console.log(error)
        return false
    }
}

// DELETE
const setDeleteUsersInformation = async function (id) {
    try {
        let sql = `
            DELETE FROM tb_usuario_informacao 
            WHERE id_usuario_informacao = ?
        `

        let result = await knexDatabase.raw(sql, [id])

        return result[0].affectedRows > 0

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    getAllUsersInformation,
    getUsersInformationById,
    getUsersInformationByUser,
    getAllUsersInformationByFamilies,
    getUsersInformationByFamily,
    setInsertUsersInformation,
    setUpdateUsersInformation,
    setDeleteUsersInformation,
}