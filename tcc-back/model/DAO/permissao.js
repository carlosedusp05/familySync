/***********************************************
 * Objetivo: CRUD de permissões de usuário
 * Autor: Kauan Antunes
 * Data: 27/05/2026
 * Versão: 1.0
 ************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");

const knexDatabase = knex(knexConfig.development);

// GET
const getAllPermissions = async function () {
    try {

        let sql = `
            SELECT
                up.id_usuario_permissao,

                f.id_familia,
                f.nome AS nome_familia,

                u.id_usuario,
                u.nome AS nome_usuario,

                up.editar_calendario,
                up.gerenciar_listas,
                up.controlar_despesas,
                up.alterar_informacoes

            FROM tb_usuario_permissao up

            INNER JOIN tb_usuario u
                ON u.id_usuario = up.id_usuario

            INNER JOIN tb_familia f
                ON f.id_familia = up.id_familia

            ORDER BY
                f.id_familia,
                u.nome
        `

        let result = await knexDatabase.raw(sql)

        return Array.isArray(result)
            ? result
            : false

    } catch (error) {
        return error
    }
}

// GET BY USER/FAMILY
const getPermissionByUserFamily = async function (
    id_usuario,
    id_familia
) {
    try {

        let sql = `
            SELECT
                up.id_usuario_permissao,

                f.id_familia,
                f.nome AS nome_familia,

                u.id_usuario,
                u.nome AS nome_usuario,

                up.editar_calendario,
                up.gerenciar_listas,
                up.controlar_despesas,
                up.alterar_informacoes

            FROM tb_usuario_permissao up

            INNER JOIN tb_usuario u
                ON u.id_usuario = up.id_usuario

            INNER JOIN tb_familia f
                ON f.id_familia = up.id_familia

            WHERE
                up.id_usuario = ${id_usuario}
            AND
                up.id_familia = ${id_familia}
        `

        let result = await knexDatabase.raw(sql)

        return Array.isArray(result)
            ? result
            : false

    } catch (error) {
        return error
    }
}

// POST
const setInsertPermission = async function (dados) {
    try {

        let sql = `
            insert into tb_usuario_permissao
            (
                id_usuario,
                id_familia,
                editar_calendario,
                gerenciar_listas,
                controlar_despesas,
                alterar_informacoes
            )
            values
            (
                ${dados.id_usuario},
                ${dados.id_familia},
                ${dados.editar_calendario},
                ${dados.gerenciar_listas},
                ${dados.controlar_despesas},
                ${dados.alterar_informacoes}
            )
        `;

        let result = await knexDatabase.raw(sql);

        return Array.isArray(result) ? result : false;

    } catch (error) {
        return error;
    }
};

// PUT
const setUpdatePermission = async function (dados) {
    try {

        let sql = `
            update tb_usuario_permissao
            set
                editar_calendario = ${dados.editar_calendario},
                gerenciar_listas = ${dados.gerenciar_listas},
                controlar_despesas = ${dados.controlar_despesas},
                alterar_informacoes = ${dados.alterar_informacoes}
            where id_usuario = ${dados.id_usuario}
            and id_familia = ${dados.id_familia}
        `;

        let result = await knexDatabase.raw(sql);

        return Array.isArray(result) ? result : false;

    } catch (error) {
        return error;
    }
};

// DELETE
const setDeletePermission = async function (
    id_usuario,
    id_familia
) {
    try {

        let sql = `
            delete from tb_usuario_permissao
            where id_usuario = ${id_usuario}
            and id_familia = ${id_familia}
        `;

        let result = await knexDatabase.raw(sql);

        return Array.isArray(result) ? result : false;

    } catch (error) {
        return error;
    }
};

module.exports = {
    getAllPermissions,
    getPermissionByUserFamily,
    setInsertPermission,
    setUpdatePermission,
    setDeletePermission
};