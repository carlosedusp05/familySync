/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva
 * Data: 22/04/2026
 * Versão: 1.0
 ************************************************/

const knex = require("knex")
const knexConfig = require("../database_config/azure/knexfile")

const knexDatabase = knex(knexConfig.development)

// GET
const getAllEvents = async function () {

    try {

        let sql = `select * from tb_eventos`

        let result = await knexDatabase.raw(sql)

        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

// GET BY ID
const getEventById = async function (id) {

    try {

        let sql = `select * from tb_eventos where id_eventos = ?`

        let result = await knexDatabase.raw(sql, [id])

        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

// GET EVENTOS POR FAMILIA
const getEventsByFamily = async function(idFamilia) {

    try {

        let sql = `select * from tb_eventos where id_familia = ? order by data asc, hora asc`

        let result = await knexDatabase.raw(sql, [idFamilia])

        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}

// POST
const setInsertEvent = async function (evento) {

    try {

        let sql = `
            insert into tb_eventos (
                id_familia,
                id_usuario,
                titulo,
                descricao,
                data,
                hora
            ) values (
                ?, ?, ?, ?, ?, ?
            )
        `

        let values = [
            evento.id_familia,
            evento.id_usuario,
            evento.titulo,
            evento.descricao,
            evento.data,
            evento.hora
        ]

        let result = await knexDatabase.raw(sql, values)

        if (result) {

            return result[0].insertId
        }

        return false

    } catch (error) {

        console.log(error)
        return false
    }
}

// PUT
const setUpdateEvent = async function (evento) {

    try {

        let sql = `
            update tb_eventos set
                titulo = ?,
                descricao = ?,
                data = ?,
                hora = ?
            where id_eventos = ?
        `

        let values = [
            evento.titulo,
            evento.descricao,
            evento.data,
            evento.hora,
            evento.id_evento
        ]

        let result = await knexDatabase.raw(sql, values)

        return !!result

    } catch (error) {

        console.log(error)
        return false
    }
}

// DELETE
const setDeleteEvent = async function (id) {

    try {

        let sql = `
            delete from tb_eventos
            where id_eventos = ?
        `

        let result = await knexDatabase.raw(sql, [id])

        return !!result

    } catch (error) {

        console.log(error)
        return false
    }
}

module.exports = {
    getAllEvents,
    getEventById,
    getEventsByFamily,
    setInsertEvent,
    setUpdateEvent,
    setDeleteEvent
}