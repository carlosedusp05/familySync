/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva
 * Data: 22/04/2026
 * Versão: 1.0
 ************************************************/
const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile.js");

const knexDatabase = knex(knexConfig.development);

const getAllFamilys = async function () {
    try {
        let sql = "select * from tb_familia"
        let result = await knexDatabase.raw(sql)
        console.log(result)
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return error
    }
}
//GET por id
const getFamilyById = async function (id) {
    try {
        let sqlFamilia = `select * from tb_familia where id_familia = ${id}`
        let sqlEndereco = `SELECT * FROM tb_endereco WHERE id_familia = ${id}`
        let sqlUsuarios = `SELECT u.*, uf.is_admin FROM tb_usuario u INNER JOIN tb_usuario_familia uf ON u.id_usuario = uf.id_usuario WHERE uf.id_familia = ${id}`

        let familia = await knexDatabase.raw(sqlFamilia)
        // console.log(familia)
        let endereco = await knexDatabase.raw(sqlEndereco)
        // console.log(endereco)
        let usuarios = await knexDatabase.raw(sqlUsuarios)
        // console.log(usuarios)
        return {
            familia: familia[0],
            endereco: endereco[0],
            usuarios: usuarios[0]
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const getFamilyComplete = async function(idFamilia) {
    try {

        let sqlFamilia = `SELECT * FROM tb_familia WHERE id_familia = ?`
        let sqlEndereco = `SELECT * FROM tb_endereco WHERE id_familia = ?`
        let sqlUsuarios = `SELECT u.*, uf.is_admin FROM tb_usuario u INNER JOIN tb_usuario_familia uf ON u.id_usuario = uf.id_usuario WHERE uf.id_familia = ?`
        let sqlEventos = `SELECT * FROM tb_eventos WHERE id_familia = ?`
        let sqlListas = `SELECT * FROM tb_lista WHERE id_familia = ?`
        let sqlFinancas = `SELECT * FROM tb_financas WHERE id_familia = ?`

        let familia = await knexDatabase.raw(sqlFamilia, [idFamilia])
        let endereco = await knexDatabase.raw(sqlEndereco, [idFamilia])
        let usuarios = await knexDatabase.raw(sqlUsuarios, [idFamilia])
        let eventos = await knexDatabase.raw(sqlEventos, [idFamilia])
        let listas = await knexDatabase.raw(sqlListas, [idFamilia])
        let financas = await knexDatabase.raw(sqlFinancas, [idFamilia])

        return {
            familia: familia[0],
            endereco: endereco[0],
            usuarios: usuarios[0],
            eventos: eventos[0],
            listas: listas[0],
            financas: financas[0]
        }

    } catch (error) {

        console.log(error)
        return false
    }
}
//POST
const setInsertFamily = async function (familia) {
    try {
        let sql = `insert into tb_familia(
                        nome,
                        telefone_residencial,
                        foto
                    )values(
                        '${familia.nome}',
                        '${familia.telefone_residencial}',
                        '${familia.foto}'
                    )`
        let result = await knexDatabase.raw(sql)
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const setInsertFamilyAddress = async function (familia) {
    try {
        let sql = 'CALL sp_cadastrar_familia_endereco(?,?,?,?,?,?,?,?,?,?)'
        let result = await knexDatabase.raw(sql, [
            familia.nome,
            familia.telefone,
            familia.foto,
            familia.cep,
            familia.logradouro,
            familia.bairro,
            familia.complemento,
            familia.cidade,
            familia.estado,
            familia.numero
        ])
        console.log(result)
        return result

    } catch (error) {

        console.log(error)

        return false
    }
}

//PUT
const setUpdateFamily = async function (familia) {
    try {
        let sql = `update tb_familia set
                        nome = '${familia.nome}',
                        telefone_residencial = '${familia.telefone_residencial}',
                        foto = '${familia.foto}'
                    where id_familia = ${familia.id_familia}`
        let result = await knexDatabase.raw(sql)
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const setUpdateFamilyAddress = async function (familia) {
    try {

        let sql = 'CALL sp_atualizar_familia_endereco(?,?,?,?,?,?,?,?,?,?,?)'

        let result = await knexDatabase.raw(sql, [
            familia.id_familia,
            familia.nome,
            familia.telefone,
            familia.foto,
            familia.cep,
            familia.logradouro,
            familia.bairro,
            familia.complemento,
            familia.cidade,
            familia.estado,
            familia.numero
        ])

        return result

    } catch (error) {

        console.log(error)
        return false
    }
}
//DELETE
const setDeleteFamily = async function (id) {
    try {
        let sql = `delete from tb_familia where id_familia = ${id}`
        let result = await knexDatabase.raw(sql)
        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const setDeleteFamilyAddress = async function (idFamilia) {
    try {

        let sql = 'CALL sp_excluir_familia_endereco(?)'

        let result = await knexDatabase.raw(sql, [idFamilia])

        return result

    } catch (error) {

        console.log(error)
        return false
    }
}
module.exports = {
    getAllFamilys,
    getFamilyById,
    getFamilyComplete,
    setInsertFamily,
    setInsertFamilyAddress,
    setUpdateFamily,
    setUpdateFamilyAddress,
    setDeleteFamily,
    setDeleteFamilyAddress
}