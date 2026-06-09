/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de enderoco na API
 * Autor: Gustavo de Paula Silva
 * Data: 06/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/endereco/controller_endereco.js')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/enderecos", cors(), async function(request, response) {
    let result = await controller.listarEndereco()
    response.json(result)
})

router.get("/endereco/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarEnderecoID(id)
    response.json(result)
})
router.delete("/endereco/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirEndereco(id)
    response.json(result)
})

router.post("/endereco", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarEndereco(dadosBody, contentType)
    response.json(result)
})
router.put("/endereco/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarEndereco(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;