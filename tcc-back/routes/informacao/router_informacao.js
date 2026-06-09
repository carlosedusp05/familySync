/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de familia na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/informacao/controller_informacao')
const router = express.Router()

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/informacoes", cors(), async function (request, response) {
    let result = await controller.listarInformacao()
    response.json(result)
})

router.get("/informacao/:id", cors(), async function (request, response) {
    let id = request.params.id
    let result = await controller.listarInformacaoID(id)
    response.json(result)
})
router.delete("/informacao/:id", cors(), async function (request, response) {
    let id = request.params.id
    let result = await controller.excluirInformacao(id)
    response.json(result)
})

router.post("/informacao", cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarInformacao(dadosBody, contentType)
    response.json(result)
})
router.put("/informacao/:id", cors(), async function (request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarInformacao(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;