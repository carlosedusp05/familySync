/***********************************************
 * Objetivo: Arquivo de configuração do knex
 * Autor: Kauan Antunes Lima
 * Data: 27/04/2026
 * Versão: 1.2
 ************************************************/

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: "localhost",
            user: "root",
            password: "12345678",
            database: "familysync",
            port: 3306,
            charset: 'utf8mb4'
        }
    }
};