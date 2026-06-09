/***********************************************
 * Objetivo: Arquivo de responsavel pela validação do contentType
 * Autor: Gustavo de Paula Silva
 * Data: 24/04/2026
 * Versão: 1.0
 ************************************************/
const mesagensDefault = require("./config_messages")

const validarContentType = function(contentType){
    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
    }
}
const validarContentTypeFormData = function(contentType){
    try {
        if(String(contentType).toLowerCase().includes('multipart/form-data')){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
    }
}

const validarValorId = function(id){
    try {
        if(id == null || id == undefined || isNaN(id) || id == "" || id < 0){
            return false
        }else{
            return true
        }
    } catch (error) {
        console.log(error)
    }
}

const validarId = (id) => {
    try {

        if (id == null || id == "" || isNaN(id) || id <= 0) {
            return false

        } else {
            return true
        }

    } catch (error) {
        return false
    }
}


module.exports = {
    validarContentType,
    validarValorId,
    validarId,
    validarContentTypeFormData
}