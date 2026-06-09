/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile.js");

const knexDatabase = knex(knexConfig.development);

//GET 
const getAllNotifications = async function () {
    try {
        let sql = `select * from tb_notificacao`
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
const getNotificationById = async function (id) {
    try {
        let sql = `select * from tb_notificacao where id_notificacao = ${id}`
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
//POST
const setInsertNotification = async function (notificacao) {
    try {
        let sql = `insert into tb_notificacao(
                        titulo,
                        descricao,
                        data
                    )values(
                        '${notificacao.titulo}',
                        '${notificacao.descricao}',
                        '${notificacao.data}'
                    )`
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
const setUpdateNotification = async function (notificacao) {
    try {
        let sql = `update tb_notificacao set
                        titulo = '${notificacao.titulo}',
                        descricao = '${notificacao.descricao}',
                        data = '${notificacao.data}'
                    where id_notificacao = ${notificacao.id_notificacao}`
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
const setDeleteNotification = async function (id) {
    try {
        let = sql = `delete from tb_notificacao where id_notificacao = ${id}`
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
    getAllNotifications,
    getNotificationById,
    setInsertNotification,
    setDeleteNotification,
    setUpdateNotification
}