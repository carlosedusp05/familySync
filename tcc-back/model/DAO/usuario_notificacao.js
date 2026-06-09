/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Kauan Antunes
 * Data: 11/05/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");

const knexDatabase = knex(knexConfig.development);


// GET 
const getAllUsersNotification = async function () {
    try {
        let sql = `
            SELECT 
                id_usuario,
                nome_usuario,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_notificacao', id_notificacao,
                            'titulo', titulo,
                            'descricao', descricao,
                            'data', data
                        )
                    ),
                    JSON_ARRAY()
                ) AS notificacoes
            FROM vw_usuario_notificacao
            GROUP BY id_usuario, nome_usuario
        `;

        let result = await knexDatabase.raw(sql);
        return result[0];

    } catch (error) {
        return false;
    }
}


// GET BY ID 
const getUsersNotificationById = async function (id) {
    try {
        let sql = `
            SELECT 
                id_usuario,
                nome_usuario,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_notificacao', id_notificacao,
                            'titulo', titulo,
                            'descricao', descricao,
                            'data', data
                        )
                    ),
                    JSON_ARRAY()
                ) AS notificacoes
            FROM vw_usuario_notificacao
            WHERE id_usuario = ?
            GROUP BY id_usuario, nome_usuario
        `;

        let result = await knexDatabase.raw(sql, [id]);
        return result[0][0] || null;

    } catch (error) {
        return false;
    }
}


// POST
const setInsertUsersNotification = async function (usuarioNotificacao) {
    try {
        let sql = `
            INSERT INTO tb_usuario_notificacao (id_usuario, id_notificacao)
            VALUES (?, ?)
        `;

        let result = await knexDatabase.raw(sql, [
            usuarioNotificacao.id_usuario,
            usuarioNotificacao.id_notificacao
        ]);

        return result.affectedRows > 0;
    } catch (error) {
        return false;
    }
}


// PUT
const setUpdateUsersNotification = async function (usuarioNotificacao) {
    try {
        let sql = `
            UPDATE tb_usuario_notificacao SET
                id_usuario = ?,
                id_notificacao = ?
            WHERE id_usuario_notificacao = ?
        `;

        let result = await knexDatabase.raw(sql, [
            usuarioNotificacao.id_usuario,
            usuarioNotificacao.id_notificacao,
            usuarioNotificacao.id_usuario_notificacao
        ]);

        return result.affectedRows > 0;
    } catch (error) {
        return false;
    }
}


// DELETE
const setDeleteUsersNotification = async function (id) {
    try {
        let sql = `
            DELETE FROM tb_usuario_notificacao 
            WHERE id_usuario_notificacao = ?
        `;

        let result = await knexDatabase.raw(sql, [id]);

        return result.affectedRows > 0;
    } catch (error) {
        return false;
    }
}


module.exports = {
    getAllUsersNotification,
    getUsersNotificationById,
    setInsertUsersNotification,
    setUpdateUsersNotification,
    setDeleteUsersNotification,
}