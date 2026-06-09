/***********************************************
 * Objetivo: Arquivo de responsavel pela realização do CRUD no banco de dados SQL
 * Autor: Gustavo de Paula Silva
 * Data: 07/05/2026
 * Versão: 1.0
 ************************************************/

const knex = require("knex");
const knexConfig = require("../database_config/azure/knexfile.js");
 
const knexDatabase = knex(knexConfig.development);

const getAutentication = async function(email) {
    try {
        let sql = `select id_usuario, email, senha, nome from tb_usuario where email = '${email}'`
        let result = await knexDatabase.raw(sql)
        if(result == [] || result == null || result == ""){
            return false
        } else{
            if (Array.isArray(result)) {
                return result
            } else {
                return false
            }
        }
    } catch (error) {
        return error
    }
}

module.exports = {
    getAutentication
}