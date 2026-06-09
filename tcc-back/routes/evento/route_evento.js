/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de eventos na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/evento/controller_evento.js')
const router = express.Router()

router.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())

    next()
})

router.get("/eventos", cors(), async function (request, response) {

    let result = await controller.listarEventos()

    response.json(result)
})

router.get("/evento/:id", cors(), async function (request, response) {

    let id = request.params.id

    let result = await controller.listarEventoID(id)

    response.json(result)
})

router.post("/evento", cors(), bodyParserJSON, async function (request, response) {

    let dadosBody = request.body

    let contentType = request.headers["content-type"]

    let result = await controller.criarEvento(dadosBody, contentType)

    response.json(result)
})

router.put("/evento/:id", cors(), bodyParserJSON, async function (request, response) {

    let id = request.params.id

    let dadosBody = request.body

    let contentType = request.headers["content-type"]

    let result = await controller.atualizarEvento(dadosBody, contentType, id)

    response.json(result)
})

router.delete("/evento/:id", cors(), async function (request, response) {

    let id = request.params.id

    let result = await controller.excluirEvento(id)

    response.json(result)
})

router.get("/eventos/familia/:idFamilia", cors(), async function(request, response) {

    let idFamilia = request.params.idFamilia

    let result = await controller.listarEventosFamilia(idFamilia)

    response.json(result)
})

module.exports = router