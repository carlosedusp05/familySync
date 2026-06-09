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

const controller = require('../../controller/usuario/controller_usuario_familia')
const { EmailClient } = require('@azure/communication-email')
const router = express.Router()

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/usuarios-familia", cors(), async function(request, response) {
    let result = await controller.listarUsuarioFamilia()
    response.json(result)
})

router.get("/usuario-familia/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarUsuarioFamiliaID(id)
    response.json(result)
})
router.delete("/usuario-familia/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirUsuarioFamilia(id)
    response.json(result)
})
router.delete("/usuario-familia", cors(), async function(request, response) {
    let id_familia = request.query.id_familia
    let id_usuario = request.query.id_usuario
    let result = await controller.excluirUsuarioFamiliaIdFamiliaIdUsuario(id_familia, id_usuario)
    response.json(result)
})
router.post("/usuario-familia", cors(), bodyParserJSON, async function(request, response) {
    console.log("BODY:", request.body)
    
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarUsuarioFamilia(dadosBody, contentType)
    response.json(result)
})
router.post("/usuario-familia/emailEnviado", cors(), bodyParserJSON, async function(request, response) {
    let token = request.query.token
    let contentType = request.headers["content-type"]
    let result = await controller.criarUsuarioFamiliaPorEmail(token, contentType)
    console.log(result)
    response.json(result)
})
router.post("/usuario-familia/email", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.enviarEmailUsuarioFamiliaPorEmail(dadosBody, contentType )
    console.log(result)
    response.json(result)
})
router.put("/usuario-familia/:id", cors(), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarUsuarioFamilia(dadosBody, contentType, id)
    response.json(result)
})
module.exports = router;