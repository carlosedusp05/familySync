/***********************************************
 * Objetivo: Arquivo de responsavel pela manipulação de TOKEN
 * Autor: Gustavo de Paula Silva
 * Data: 14/05/2026
 * Versão: 1.0
 ************************************************/

const jwt = require('jsonwebtoken')
require('dotenv').config()

const getToken = (usuario) => {
    return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '168h' })
};
const getTokenString = (code) => {
    return jwt.sign({"code":code}, process.env.JWT_SECRET, { expiresIn: '168h' })
};
const getDecodedToken = (token) => {
    return jwt.decode(token)
};

const verificarToken = function(request, response, next) {
    const authHeader = request.headers['authorization']
    if (!authHeader) {
        return response.status(401).json({ 
            message: 'Acesso negado' 
        });
    }

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return response.status(403).json({ 
                    message: 'Token inválido' 
                })
            }

            request.user = decoded
            next()
        })
    } catch (err) {
        return response.status(500).json({ 
            message: 'Erro interno' 
        });
    }
}

module.exports={
    getToken,
    getDecodedToken,
    verificarToken,
    getTokenString
}