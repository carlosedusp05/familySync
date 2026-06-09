/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de login na API
 * Autor: Gustavo de Paula Silva
 * Data: 07/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()
const jwt = require('../../jwt/jwt_service.js')
const controller = require('../../controller/login/controller_login.js');
const router = express.Router()


router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
    router.use(cors())
    next()
})

router.post("/login", cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    
    let result = await controller.validarLogin(dadosBody, contentType)
    delete result.Response.senha
    let token = jwt.getToken(result.Response)
    result.Response = token
    response.json(result)
})

router.get("/usuario", cors(), jwt.verificarToken,  async function(request, response) {
    response.json(request.user)
})

router.post("/senha-nova", cors(), async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let result = await controller.validarTrocaSenha(dadosBody, contentType)
    response.json(result)
})
router.post("/adicionar-familia", cors(), async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let result = await controller.validarEntradoFamilia(dadosBody, contentType)
    response.json(result)
})
module.exports = router;