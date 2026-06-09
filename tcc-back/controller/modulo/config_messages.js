/***********************************************
 * Objetivo: Arquivo responsavel pela padronização das mensagens de resposta da API
 * Autor: Gustavo de Paula Silva
 * Data: 22/04/2026
 * Versão: 1.0
 ************************************************/

const dataAtual = new Date()

const HEADER = {
    Data: dataAtual.getDate,
    Desenvolvedor: "Gustavo de Paula Silva",
    Version: '1.0.22.4.26',
    StatusCode: Number,
    Response: {}
}
// MENSAGEM DE ERRO
const ERRO_NOT_FOUND = {StatusCode: 400, message: "Erro de requisição"}
const ERRO_INTERNAL_SERVER_MODEL = {StatusCode: 500, message: "Erro na camada de model"}
const ERRO_INTERNAL_SERVER_CONTROLLER = {StatusCode: 500, message: "Erro na camada de controller"}
const ERRO_REQUIRED_FIELDS = {StatusCode: 400, message: "Erro em campos obrigatorios", campo: String}
const ERRO_CONTENT_TYPE = {StatusCode: 415, message: "Body enviado de tipo diferente de Json"}
const ERRO_RELATION_TABLE = {StatusCode: 200, message: "Erro em tabela de relacionamento"}
const ERRO_INVALID_ID = {StatusCode: 400, message: "Erro em campo de id"}
const ERRO_INVALID_PASSWORD = {StatusCode: 400, message: "Senha invalida"}
const ERRO_ADM_NOT_FOUND = {StatusCode: 400, message: "Administrador de familia não encontrado"}

// MENSAGEM DE SUCESSO
const SUCCESS_REQUEST = {StatusCode: 200, message: "Requisição bem sucedida"}
const SUCCESS_CREATED_ITEM = {StatusCode: 201, message: "Item criado com sucesso"}
const SUCCESS_UPDATED_ITEM = {StatusCode: 200, message: "Item atualizado com sucesso"}
const SUCCESS_DELETED_ITEM = {StatusCode: 200, message: "Item excluido com sucesso"}

module.exports = {
    HEADER,
    ERRO_NOT_FOUND,
    ERRO_INTERNAL_SERVER_MODEL,
    ERRO_INTERNAL_SERVER_CONTROLLER,
    ERRO_REQUIRED_FIELDS,
    ERRO_CONTENT_TYPE,
    ERRO_RELATION_TABLE,
    SUCCESS_REQUEST,
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM,
    ERRO_INVALID_ID,
    ERRO_INVALID_PASSWORD,
    ERRO_ADM_NOT_FOUND
}