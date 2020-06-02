'use strict';
let configDB = require('../conectDB/dynamoDB')
var CryptoJS = require("crypto-js");

const USERS_TABLE = process.env.USERS_TABLE;
const CANDIDATOS_TABLE = process.env.CANDIDATOS_TABLE;

let dynamoDB = configDB.DB();
const QueriesPrueba = require('../queries/query-prueba');

var jwt = require('../services/jwt')

const pruebas = async (req, res) => {
    const newQuery = await QueriesPrueba.select_test;
    console.log('test', newQuery)
    res.send('Hola mundo con expressjs');
}

const saveUser = async (req, res) => {
    let {userId, name, email, password, votos} = req.body;
    userId = CryptoJS.AES.encrypt(userId, email).toString();
    votos = 0;
    if (req.body.password && req.body.name && req.body.email) {
        const paramsUser = {
            TableName: USERS_TABLE,
            Item: {
              userId, name, email, password, votos
            },
            Key: {
                email: email, 
            }
        };

         dynamoDB.get(paramsUser, (error, result) => {
             console.log('error', error)
             if(error){
                res.status(500).json({
                    succes: 'Internal error'
                })
             } else {
                 if(result.Item){
                     res.status(200).json({
                         succes: 'usuario existe'
                     })
                 } else {
                    dynamoDB.put(paramsUser, (error) => {
                        if(error) {
                            console.log(error);
                            res.status(400).json({
                              error: 'No se ha podido crear el usuario'
                            })
                          } else {
                            res.status(200).json({
                              succes: 'usuario creado'
                            })
                          }
                    });
                 }
             }
         });
    } else {
        res.status(200).json({
            error: 'introduce los datos correctos'
        })
    }
}

const loginUser = async (req, res) => {
        let {email, password, gettoken} = req.body;
    console.log('token', gettoken )
    const paramsUser = {
        TableName: USERS_TABLE,
        Key: {
            email: email, 
        }
    };
    dynamoDB.get(paramsUser, (error, result) => {
        if(error){
           res.status(500).json({
               succes: 'Internal error'
           })
        } else {
            if(result.Item){
                const {Item} = result;
                if(Item.password == password){
                    if(gettoken){
                        console.log('entra', gettoken )
                        res.status(200).json({
                            user: {
                                data: {
                                    email: Item.email,
                                    name: Item.name,
                                },
                                token: jwt.createToken(Item)
                            }
                        })
                    } else {
                        res.status(200).json({
                            succes: 'usuario existe',
                            user: Item
                        })
                    }
                    
                }else {
                    res.status(404).json({
                        succes: 'el usuario no ha podido loguearse'
                    })
                }
            } else {
                res.status(404).json({
                    succes: 'el usuario no existe'
                })
            }
        }
    });
}


const vote = async (req, res) => {
    
    let {Id, email, voto} = req.body;
    let votos = 0;
    const paramsUser = {
        TableName: USERS_TABLE,
        Key: {
            email: email
        }
    };
    
    dynamoDB.get(paramsUser, (error, result) => {
        if(error){
           res.status(500).json({
               succes: 'Internal error'
           })
        } else {
            if(result.Item){
                const {Item} = result;
                votos = Item.votos

                if(votos >= 4) {
                    res.status(200).json({
                        succes: 'usuario no puede votar mas',
                        tope: true
                    })
                } else {
                    votos += 1;
                    const updateUser = {
                        TableName: USERS_TABLE,
                        Key: {
                            email: email
                        },
                        UpdateExpression: "set votos = :votos",
                        ExpressionAttributeValues:{
                                 ":votos":votos
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    console.log('votos', votos)
                    dynamoDB.update(updateUser, (error) => {
                     if(error) {
                         console.log(error);
                         res.status(400).json({
                           error: 'No se ha podido actualizar el dato'
                         })
                       } else {
                        const paramsCandidato = {
                            TableName: CANDIDATOS_TABLE,
                            Key: {
                                Id: Id, 
                            }
                        };
                        
                        //  res.json({
                        //    succes: true,
                        //    message: 'dato actualizado correctamente',
                        //  });
                         dynamoDB.get(paramsCandidato, (error, result) => {
                            if(error){
                                res.status(500).json({
                                    succes: 'Internal error'
                                })
                             } else {
                                if(result.Item){
                                    const {Item} = result;
                                    let votosUp = Item.votosUp; 
                                    let votosDown = Item.votosDown;
                                    let votos = Item.votos;    
                                    votosUp = parseInt(votosUp) 
                                    votosDown = parseInt(votosDown)
                                    votos = parseInt(votos)
                                    votos += 1
                                    const updateCandidatoVoto = {
                                        TableName: CANDIDATOS_TABLE,
                                        Key: {
                                            Id: Id
                                        },
                                        UpdateExpression: "set votos = :votos",
                                        ExpressionAttributeValues:{
                                                 ":votos":votos
                                        },
                                        ReturnValues:"UPDATED_NEW"
                                    };
                                    dynamoDB.update(updateCandidatoVoto, (error) => {
                                        if(error) {
                                            console.log(error);
                                            res.status(400).json({
                                              error: 'No se ha podido actualizar el dato'
                                            })
                                          } else {
                                            console.log('votos candidato', votos)
                                            if (voto == 1) {
                                                votosUp += 1
                                                console.log('number',votosUp)
                                                // res.status(500).json({
                                                //     user: Item
                                                // })
                                                const updateCandidato = {
                                                    TableName: CANDIDATOS_TABLE,
                                                    Key: {
                                                        Id: Id
                                                    },
                                                    UpdateExpression: "set votosUp = :votosUp",
                                                    ExpressionAttributeValues:{
                                                             ":votosUp":votosUp
                                                    },
                                                    ReturnValues:"UPDATED_NEW"
                                                };
                                                dynamoDB.update(updateCandidato, (error) => {
                                                    if(error) {
                                                        console.log(error);
                                                        res.status(400).json({
                                                          error: 'No se ha podido actualizar el dato'
                                                        })
                                                      } else {
                                                        res.status(200).json({
                                                            menssage: 'dato actualizado correctamente'
                                                        })
                                                      }
                                                    });
                                            } else {
                                                votosDown += 1
                                                console.log('number',votosDown)
                                                // res.status(500).json({
                                                //     user: Item
                                                // })
                                                const updateCandidato = {
                                                    TableName: CANDIDATOS_TABLE,
                                                    Key: {
                                                        Id: Id
                                                    },
                                                    UpdateExpression: "set votosDown = :votosDown",
                                                    ExpressionAttributeValues:{
                                                             ":votosDown":votosDown
                                                    },
                                                    ReturnValues:"UPDATED_NEW"
                                                };
                                                dynamoDB.update(updateCandidato, (error) => {
                                                    if(error) {
                                                        console.log(error);
                                                        res.status(400).json({
                                                          error: 'No se ha podido actualizar el dato'
                                                        })
                                                      } else {
                                                        res.status(200).json({
                                                            menssage: 'dato actualizado correctamente'
                                                        })
                                                      }
                                                    });
                                            }
                                          }
                                        });
                                    
                                } else {
                                    res.status(404).json({
                                        succes: 'Candidato no encontrado'
                                    })
                                }
                             }
                         });
                       }
                  });
                }

                // console.log(votos)
                // res.status(200).json({
                //     succes: 'usuario existe',
                //     user: Item
                // })
            } else {
                res.status(404).json({
                    succes: 'el usuario no existe'
                })
            }
        }
    });   
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    vote
}