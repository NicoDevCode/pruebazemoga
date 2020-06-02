'use strict';

let express = require('express')
let UserController = require('../controllers/candidato')
let api = express.Router();

api.get('/prueba2', UserController.pruebas)
api.post('/candidato', UserController.saveCandidato)
api.get('/allcandidatos', UserController.allCandidatos)


module.exports = api;