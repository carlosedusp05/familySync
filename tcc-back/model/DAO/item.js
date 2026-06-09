/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile.js");

const knexDatabase = knex(knexConfig.development);

// GET
const getAllItens = async function () {
    try {
        let sql = `SELECT * FROM tb_item`
        let result = await knexDatabase.raw(sql)

        return result
    } catch (error) {
        console.log(error)
        return false
    }
}

// GET por id
const getItenById = async function (id) {
    try {
        let sql = `SELECT * FROM tb_item WHERE id_item = ?`
        let result = await knexDatabase.raw(sql, [id])

        return result[0]
    } catch (error) {
        console.log(error)
        return false
    }
}

// POST
const setInsertIten = async function (item) {
    try {
        let sql = `
            INSERT INTO tb_item (
                id_lista,
                nome_item,
                quantidade,
                valor_unitario,
                comprado
            ) VALUES (?, ?, ?, ?, ?)
        `

        let result = await knexDatabase.raw(sql, [
            item.id_lista,
            item.nome_item,
            item.quantidade,
            item.valor_unitario,
            item.comprado
        ])

        let idItemCriado = result[0].insertId

        let itemCriado = await getItenById(idItemCriado)

        if (itemCriado && itemCriado.length > 0) {
            return itemCriado[0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}


// PUT sem id_lista
const setUpdateIten = async function (item) {
    try {
        let sql = `
            UPDATE tb_item SET
                nome_item = ?,
                quantidade = ?,
                valor_unitario = ?,
                comprado = ?
            WHERE id_item = ?
        `

        let result = await knexDatabase.raw(sql, [
            item.nome_item,
            item.quantidade,
            item.valor_unitario,
            item.comprado,
            item.id_item
        ])

        return result
    } catch (error) {
        console.log(error)
        return false
    }
}
const setUpdateItenStatus = async function (item) {
    try {
        let sql = `
            UPDATE tb_item SET
                comprado = ?
            WHERE id_item = ?
        `

        let result = await knexDatabase.raw(sql, [
            item.comprado,
            item.id_item
        ])
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}
// DELETE
const setDeleteIten = async function (id) {
    try {
        let sql = `DELETE FROM tb_item WHERE id_item = ?`
        let result = await knexDatabase.raw(sql, [id])

        return result
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    getAllItens,
    getItenById,
    setInsertIten,
    setUpdateItenStatus,
    setUpdateIten,
    setDeleteIten
}
