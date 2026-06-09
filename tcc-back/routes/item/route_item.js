/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de item na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/item/controller_item.js')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/itens", cors(), async function(request, response) {
    let result = await controller.listarItens()
    response.json(result)
})

router.get("/item/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarItemID(id)
    response.json(result)
})
router.delete("/item/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirItem(id)
    response.json(result)
})

router.post("/item", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarItem(dadosBody, contentType)
    response.json(result)
})
router.put("/item/lote", cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.editarItemLote(dadosBody, contentType)
    response.json(result)
})
router.put("/item/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atulizarItem(dadosBody, contentType, id)
    response.json(result)
})

module.exports = router;
