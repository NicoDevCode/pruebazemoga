'use strict';
let configDB = require('../conectDB/dynamoDB')
const USERS_TABLE = process.env.USERS_TABLE;
const CANDIDATOS_TABLE = process.env.CANDIDATOS_TABLE;

let dynamoDB = configDB.DB();
const QueriesPrueba = require('../queries/query-prueba');

const pruebas = async (req, res) => {
    const newQuery = await QueriesPrueba.select_test;
    console.log('test', newQuery)
    res.send('Hola mundo con expressjs');
}


const saveCandidato = async (req, res) => {
    let {Id, name, ref, description, votosUp, votosDown, votos} = req.body;
    console.log('req',req.body)
    const params = {
        TableName: CANDIDATOS_TABLE,
        Item: {
            Id, name, ref, description, votosUp, votosDown, votos
        },
    };


    dynamoDB.put(params, (error) => {
        if(error) {
            console.log(error);
            res.status(400).json({
              error: 'No se ha podido acceder el usuario'
            })
          } else {
            res.status(400).json({
                succes: 'Candidato creado',
                data: {
                    Id: Id,
                    name: name,
                    ref: ref,
                    description: description,
                    votosUp: votosUp,
                    votosDown: votosDown,
                    votos: votos
                }
            })
          }
    });
}


const allCandidatos = async (req, res) => {
    const params = {
        TableName: CANDIDATOS_TABLE,
      }
    dynamoDB.scan(params, (error, result) => {
      if(error) {
        console.log(error);
        res.status(400).json({
          error: 'No se ha podido crear el usuario'
        })
      } else {
        const {Items} = result;
        res.json({
          succes: true,
          message: 'Candidatos cargados correctamente',
          candidatos: Items
        });
      }
    });
}





module.exports = {
    pruebas,
    saveCandidato,
    allCandidatos   
}