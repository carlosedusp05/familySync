/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de familia na API
 * Autor: Gustavo de Paula Silva
 * Data: 27/04/2026
 * Versão: 1.0
 ************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controller = require('../../controller/familia/controller_familia.js')
const router = express.Router()

const multer = require('multer');
const upload = multer();

router.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

router.get("/familias", cors(), async function(request, response) {
    let result = await controller.listarFamilias()
    response.json(result)
})

router.get("/familia/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarFamiliaID(id)
    response.json(result)
})
router.get("/familia/:id/completa", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.listarFamiliaCompleta(id)
    response.json(result)
})
router.delete("/familia/:id", cors(), async function(request, response) {
    let id = request.params.id
    let result = await controller.excluirFamilia(id)
    response.json(result)
})

router.post("/familia", cors(), upload.single('foto'), async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let file = request.file
    let result = await controller.criarFamilia(dadosBody, file, contentType)
    response.json(result)
})
router.post("/familia/endereco", cors(), upload.single('foto'), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let file = request.file
    let result = await controller.criarFamiliaEndereco(dadosBody, file, contentType)
    response.json(result)
})
router.put("/familia/:id", cors(), upload.single('foto'), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let file = request.file
    let result = await controller.atulizarFamilia(dadosBody, file, contentType, id)
    response.json(result)
})
router.put("/familia/endereco/:id", cors(), upload.single('foto'), async function(request, response) {
    let id = request.params.id
    let dadosBody = request.body
    let contentType = request.headers["content-type"]
    let file = request.file
    let result = await controller.atualizarFamiliaEndereco(dadosBody,file, contentType, id)
    response.json(result)
})

router.delete("/familia/endereco/:id", cors(), async function(request, response) {
    let id = request.params.id

    let result = await controller.excluirFamiliaEndereco(id)
    response.json(result)
})

module.exports = router;