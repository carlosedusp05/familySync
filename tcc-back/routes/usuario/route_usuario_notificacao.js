/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de usuario_familia na API
 * Autor: Kauan Antunes
 * Data: 11/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/usuario/controller_usuario_notificacao')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/usuarios-notificacoes", cors(), async function(request, response) {
    let result = await controller.listarUsuarioNotificacao()
    
    response.json(result)
})

router.get("/usuario-notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarUsuarioNotificacaoID(id)
    response.json(result)
})
router.delete("/usuario-notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirUsuarioNotificacao(id)
    response.json(result)
})

router.post("/usuario-notificacao", cors(), bodyParserJSON, async function(request, response) {
    console.log("BODY:", request.body)
    
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarUsuarioNotificacao(dadosBody, contentType)
    response.json(result)
})
router.put("/usuario-notificacao/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarUsuarioNotificacao(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;