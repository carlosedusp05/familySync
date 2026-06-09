/***********************************************
 * Objetivo: Arquivo responsavel pela manipulação de rotas das financas na API
 * Autor: Kauan Antunes Lima
 * Data: 06/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/financias/controller_financas.js')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/financas", cors(), async function(request, response) {
    let result = await controller.listarFinancas()
    response.json(result)
})

router.get("/financas/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarFinancasID(id)
    response.json(result)
})

router.get("/financas/diarias/:id", cors(), async function(request, response){
    let id = request.params.id
    let result = await controller.listarFinancasDiarias(id)
    response.json(result)
})

router.get("/financas/semanais/:id", cors(), async function(request, response){
    let id = request.params.id
    let result = await controller.listarFinancasSemanais(id)
    response.json(result)
})

router.get("/financas/mensais/:id", cors(), async function(request, response){
    let id = request.params.id
    let result = await controller.listarFinancasMensais(id)
    response.json(result)
})

router.get("/financas/anuais/:id", cors(), async function(request, response){
    let id = request.params.id
    let result = await controller.listarFinancasAnuais(id)
    response.json(result)
})

router.delete("/financas/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirFinancas(id)
    response.json(result)
})

router.post("/financas", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarFinancas(dadosBody, contentType)
    response.json(result)
})
router.put("/financas/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarFinancas(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;