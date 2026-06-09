/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de usuario na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express');
const cors =  require('cors')
const bodyParser = require('body-parser') 

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/usuario/controller_usuario.js')
const controllerLogin = require('../../controller/login/controller_login.js');
const jwt = require('jsonwebtoken');
const router = express.Router()
const token = require('../login/router_login.js')

const multer = require('multer');
const upload = multer();

const verificarToken = function(request, response, next) {
    const header = request.headers['authorization']
    // console.log(header)

    const token = header?.split(' ')[1]
    // console.log(token)
    try{
        const tokenVerificado = jwt.verify(token, process.env.JWT_SECRET, (error, user) =>{
            request.user = user
            next()
        })
    } catch (error){
        return error
    }
}

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/usuarios", cors(), async function(request, response) {
    let result = await controller.listarUsuarios()
    response.json(result)
})

router.get("/senha-nova/code", cors(),bodyParserJSON, async function(request, response) {
    let email = request.query.email
    let result = await controllerLogin.validarTrocaSenha(email)
    response.json(result)
})

router.put("/usuario/trocar-senha", bodyParserJSON, cors(), async function(request, response) {
    let token = request.query.token
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let result = await controller.atulizarSenhaUsuario(dadosBody, token, contentType)
    response.json(result)
})
router.put("/usuario-cadastrado/trocar-senha", bodyParserJSON, cors(), async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let result = await controller.atulizarSenhaUsuarioCadastrado(dadosBody, contentType)
    response.json(result)
})

router.get("/usuario/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarUsuarioID(id)
    response.json(result)
})
router.delete("/usuario/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirUsuario(id)
    response.json(result)
})

router.post("/usuario", cors(), upload.single('foto'), async function(request, response) {
    let dadosBody = request.body
    let file = request.file
    let contentType = request.headers["content-type"]

    let result = await controller.criarUsuario(dadosBody, file, contentType)
    response.json(result)
})
router.put("/usuario/:id", cors(), upload.single('foto'), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let file = request.file
    let contentType = request.headers["content-type"]

    let result = await controller.atulizarUsuario(dadosBody, file, contentType, id)
    response.json(result)
})
module.exports = router;