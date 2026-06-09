/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de lista na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/lista/controller_lista.js')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/listas", cors(), async function(request, response) {
    let result = await controller.listarListas()
    response.json(result)
})

router.get('/lista/completa/familia/:idFamilia', async function(request, response) {
    let idFamilia = request.params.idFamilia
    let result = await controller.listarListaCompletaPorFamilia(idFamilia)
    
    response.status(result.StatusCode || result.status_code)
    response.json(result)
})
router.get('/lista-favorita/completa/familia/:idFamilia', async function(request, response) {
    let idFamilia = request.params.idFamilia
    let result = await controller.listarListaFavoritaCompletaPorFamilia(idFamilia)
    
    response.status(result.StatusCode || result.status_code)
    response.json(result)
})
router.delete("/lista/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirLista(id)
    response.json(result)
})
router.get("/lista/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarListaID(id)
    response.json(result)
})

router.post("/lista", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarLista(dadosBody, contentType)
    response.json(result)
})
router.put("/lista/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atulizarLista(dadosBody, contentType, id)
    response.json(result)
})
router.put("/lista/favorita/:id", cors(), bodyParserJSON, async function(request, response){
    let id = request.params.id
    let favorita = request.body.favorita

    let result = await controller.favoritarLista(id, favorita)
    response.json(result)
})
router.put("/lista-favorita-lote", cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let result = await controller.favoritarListaLote(dadosBody, contentType)
    response.json(result)
})
module.exports = router;
