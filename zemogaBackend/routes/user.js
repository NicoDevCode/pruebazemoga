'use strict';

let express = require('express')
let UserController = require('../controllers/user')
let api = express.Router();

api.get('/prueba', UserController.pruebas)
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/vote', UserController.vote);

module.exports = api;