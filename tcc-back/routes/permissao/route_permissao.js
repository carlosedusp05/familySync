/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de routas de permissao na API
 * Autor: Kauan Antunes
 * Data: 27/05/2026
 * Versão: 1.0
 ************************************************/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const bodyParserJSON = bodyParser.json();

const controller =
require('../../controller/permissao/controller_permissao');

const router = express.Router();

router.use((request, response, next) => {

    response.header(
        'Access-Control-Allow-Origin',
        '*'
    );

    response.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    router.use(cors());

    next();
});

// GET ALL
router.get(
    "/permissoes",
    cors(),
    async function(request,response){

        let result = await controller.listarPermissoes();
        response.json(result);
    }
);

// GET USER/FAMILY
router.get(
    "/permissoes/usuario/:id_usuario/familia/:id_familia",
    cors(),
    async function(request,response){

        let result = await controller.listarPermissaoUsuario(request.params.id_usuario, request.params.id_familia);
        response.json(result);
    }
);

// POST
router.post(
    "/permissao",
    cors(),
    bodyParserJSON,
    async function(request,response){

        let result = await controller.criarPermissao(request.body);
        response.json(result);
    }
);

// PUT
router.put(
    "/permissao",
    cors(),
    bodyParserJSON,
    async function(request,response){

        let result = await controller.atualizarPermissao(request.body);
        response.json(result);
    }
);

// DELETE
router.delete(
    "/permissao/usuario/:id_usuario/familia/:id_familia",
    cors(),
    async function(request,response){

        let result = await controller.excluirPermissao(request.params.id_usuario,request.params.id_familia);
        response.json(result);
    }
);

module.exports = router;