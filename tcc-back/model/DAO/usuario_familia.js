/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Kauan Antunes
 * Data: 11/05/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile");

const knexDatabase = knex(knexConfig.development);

const isFirstUserInFamily = async function (id_familia) {
    try {
        let sql = `
            SELECT COUNT(*) AS total
            FROM tb_usuario_familia
            WHERE id_familia = ?
        `;

        let result = await knexDatabase.raw(sql, [id_familia]);

        return result[0][0].total == 0;

    } catch (error) {
        console.log(error);
        return false;
    }
};

const getUserAdmFamilyById = async function (id) {
    try {

        let sql = `
            SELECT
                f.id_familia,
                f.nome AS nome_familia,
                u.id_usuario,
                u.nome AS nome_usuario,
                u.email,
                uf.is_admin

            FROM tb_usuario_familia uf

            INNER JOIN tb_usuario u
                ON u.id_usuario = uf.id_usuario

            INNER JOIN tb_familia f
                ON f.id_familia = uf.id_familia

            WHERE f.id_familia = ? AND is_admin = 1
        `

        let result = await knexDatabase.raw(sql, [id])
        let dados = result[0]

        if (dados.length == 0)
            return false


        return dados

    } catch (error) {

        console.log(error)

        return false
    }
}
// GET ALL
const getAllUsersFamily = async function () {
    try {

        let sql = `
            SELECT
                f.id_familia,
                f.nome AS nome_familia,
                u.id_usuario,
                u.nome AS nome_usuario,
                u.email,
                uf.is_admin
            FROM tb_usuario_familia uf
            INNER JOIN tb_usuario u
                ON u.id_usuario = uf.id_usuario
            INNER JOIN tb_familia f
                ON f.id_familia = uf.id_familia
            ORDER BY f.id_familia
        `;

        let result = await knexDatabase.raw(sql);
        let dados = result[0];

        let familias = {};

        dados.forEach(item => {

            if (!familias[item.id_familia]) {
                familias[item.id_familia] = {
                    id_familia: item.id_familia,
                    nome_familia: item.nome_familia,
                    membros: []
                };
            }

            familias[item.id_familia].membros.push({
                id_usuario: item.id_usuario,
                nome_usuario: item.nome_usuario,
                email: item.email,
                is_admin: item.is_admin
            });
        });

        return Object.values(familias);

    } catch (error) {
        console.log(error);
        return false;
    }
};


// GET BY ID

const getUsersFamilyById = async function (id) {
    try {

        let sql = `
            SELECT
                f.id_familia,
                f.nome AS nome_familia,
                u.id_usuario,
                u.nome AS nome_usuario,
                u.email,
                uf.is_admin
            FROM tb_usuario_familia uf
            INNER JOIN tb_usuario u
                ON u.id_usuario = uf.id_usuario
            INNER JOIN tb_familia f
                ON f.id_familia = uf.id_familia
            WHERE f.id_familia = ?
            ORDER BY u.nome
        `;

        let result = await knexDatabase.raw(sql, [id]);
        let dados = result[0];

        if (dados.length == 0)
            return false;

        let familia = {
            id_familia: dados[0].id_familia,
            nome_familia: dados[0].nome_familia,
            membros: []
        };

        dados.forEach(item => {
            familia.membros.push({
                id_usuario: item.id_usuario,
                nome_usuario: item.nome_usuario,
                email: item.email,
                is_admin: item.is_admin
            });
        });

        return familia;

    } catch (error) {
        console.log(error);
        return false;
    }
};
const getUserFamilyByIdUserIdFamily = async function (id_familia, id_usuario) {
    try {

        let sql = `
            SELECT
                f.id_familia,
                f.nome AS nome_familia,
                u.id_usuario,
                u.nome AS nome_usuario,
                u.email,
                uf.is_admin
            FROM tb_usuario_familia uf
            INNER JOIN tb_usuario u
                ON u.id_usuario = uf.id_usuario
            INNER JOIN tb_familia f
                ON f.id_familia = uf.id_familia
            WHERE f.id_familia = ? 
            AND u.id_usuario = ?
            ORDER BY u.nome
        `;

        let result = await knexDatabase.raw(sql, [id_familia, id_usuario]);
        let dados = result[0];

        if (dados.length == 0)
            return false;

        let familia = {
            id_familia: dados[0].id_familia,
            nome_familia: dados[0].nome_familia,
            membros: []
        };

        dados.forEach(item => {
            familia.membros.push({
                id_usuario: item.id_usuario,
                nome_usuario: item.nome_usuario,
                email: item.email,
                is_admin: item.is_admin
            });
        });

        return familia;

    } catch (error) {
        console.log(error);
        return false;
    }
};

// INSERT (ID)

const setInsertUsersFamily = async function (usuarioFamilia) {
    try {

        let isFirst = await isFirstUserInFamily(usuarioFamilia.id_familia);

        let sql = `
            INSERT INTO tb_usuario_familia 
            (id_usuario, id_familia, is_admin)
            VALUES (?, ?, ?)
        `;

        let result = await knexDatabase.raw(sql, [
            usuarioFamilia.id_usuario,
            usuarioFamilia.id_familia,
            isFirst
        ]);

        return !!result;

    } catch (error) {
        console.log(error);
        return false;
    }
};


// INSERT (EMAIL)

const setInsertUsersFamilyByUserEmail = async function (usuarioFamilia) {
    try {
        console.log(usuarioFamilia)
        let sqlSearch = `
            SELECT id_usuario 
            FROM tb_usuario 
            WHERE email = ?
        `;

        let user = await knexDatabase.raw(sqlSearch, [
            usuarioFamilia.email
        ]);

        if (user[0].length == 0)
            return null;

        let id_usuario = user[0][0].id_usuario;

        let isFirst = await isFirstUserInFamily(usuarioFamilia.id_familia);

        let sqlInsert = `
            INSERT INTO tb_usuario_familia 
            (id_usuario, id_familia, is_admin)
            VALUES (?, ?, ?)
        `;

        let result = await knexDatabase.raw(sqlInsert, [
            id_usuario,
            usuarioFamilia.id_familia,
            isFirst
        ]);

        return !!result;

    } catch (error) {
        console.log(error);

        if (error.code == "ER_DUP_ENTRY")
            return "duplicado";

        return false;
    }
};


// UPDATE

const setUpdateUsersFamily = async function (usuarioFamilia) {
    try {

        let sql = `
            UPDATE tb_usuario_familia SET
                id_usuario = ?,
                id_familia = ?
            WHERE id_usuario_familia = ?
        `;

        let result = await knexDatabase.raw(sql, [
            usuarioFamilia.id_usuario,
            usuarioFamilia.id_familia,
            usuarioFamilia.id_usuario_familia
        ]);

        return !!result;

    } catch (error) {
        console.log(error);
        return false;
    }
};


// DELETE

const setDeleteUsersFamily = async function (id) {
    try {

        let sql = `
            DELETE FROM tb_usuario_familia 
            WHERE id_usuario_familia = ?
        `;

        let result = await knexDatabase.raw(sql, [id]);

        return !!result;

    } catch (error) {
        console.log(error);
        return false;
    }
};

const setDeleteUserFamilyIdUserIdFamily = async function (id_familia, id_usuario) {
    try {

        let sql = `
            DELETE FROM tb_usuario_familia 
            WHERE id_usuario = ? AND id_familia = ?
        `;

        let result = await knexDatabase.raw(sql, [id_usuario, id_familia]);
        console.log(result)
        return !!result;

    } catch (error) {
        console.log(error);
        return false;
    }
};
module.exports = {
    getAllUsersFamily,
    getUsersFamilyById,
    setInsertUsersFamily,
    setInsertUsersFamilyByUserEmail,
    getUserFamilyByIdUserIdFamily,
    setDeleteUserFamilyIdUserIdFamily,
    setUpdateUsersFamily,
    setDeleteUsersFamily,
    getUserAdmFamilyById
};