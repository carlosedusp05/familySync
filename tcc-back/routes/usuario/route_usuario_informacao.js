/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de usuario_informacao na API
 * Autor: Kauan Antunes
 * Data: 07/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/usuario/controller_usuario_informacao')

const router = express.Router()

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    router.use(cors())
    next()
})

router.get("/usuarios-informacoes", cors(), async function(request, response) {
    let result = await controller.listarUsuarioInformacao()

    response.status(result.status_code)
    response.json(result)
})

router.get('/usuario-informacao/familias', cors(), async function(request, response) {
    let result = await controller.listarUsuarioInformacaoPorFamilias()

    response.status(result.status_code)
    response.json(result)
})

router.get('/usuario-informacao/familia/:idFamilia', cors(), async function(request, response) {
    let idFamilia = request.params.idFamilia

    let result = await controller.listarUsuarioInformacaoPorFamilia(idFamilia)

    response.status(result.status_code)
    response.json(result)
})

router.get("/usuario-informacao/usuario/:id", cors(), async function(request, response) {
    let idUsuario = request.params.id

    let result = await controller.listarUsuarioInformacaoPorUsuario(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

router.get("/usuario-informacao/:id", cors(), async function(request, response) {
    let id = request.params.id

    let result = await controller.listarUsuarioInformacaoID(id)

    response.status(result.status_code)
    response.json(result)
})

router.post("/usuario-informacao", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.criarUsuarioInformacao(dadosBody, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put("/usuario-informacao/:id", cors(), bodyParserJSON, async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]

    let result = await controller.atualizarUsuarioInformacao(dadosBody, contentType, id)

    response.status(result.status_code)
    response.json(result)
})

router.delete("/usuario-informacao/:id", cors(), async function(request, response) {
    let id = request.params.id

    let result = await controller.excluirUsuarioInformacao(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router