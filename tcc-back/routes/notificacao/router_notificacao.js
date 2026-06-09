/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de notificacao na API
 * Autor: Gustavo de Paula Silva
 * Data: 15/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/notificacao/controller_notificacao.js')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/notificacoes", cors(), async function(request, response) {
    let result = await controller.listarNotificacoes()
    response.json(result)
})

router.get("/notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarNotificacaoID(id)
    response.json(result)
})
router.delete("/notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirNotificacao(id)
    response.json(result)
})

router.post("/notificacao", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarNotificacao(dadosBody, contentType)
    response.json(result)
})
router.put("/notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atulizarNotificacao(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;