/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const avisclient = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------- POST NOUVEAU AVIS CLIENT ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

avisclient.post("/Newavisclient", (req, res) =>{

    console.log(req.body)

    const InfoAvisClient = {

        commentaire: req.body.commentaire,

    }
    database.avisclient.findOne({

        where:{commentaire: req.body.commentaire}

    })
    .then(avisclient =>{

        if(!avisclient){

            database.avisclient.create(InfoAvisClient)

            .then(avisclient =>{

                res.json(avisclient)

            })
            .catch(err => {
                res.json({
                    error:"Avis Client non crée" + err
                })
            })
        }
        else{
            res.json({
                error:"Avis Client est deja créé "
            })
        }
    })
    .catch(err => {
        res.json({
            error: "erreur" + err
        })
    })
})

/* ------------------------------------- Get findOne ---------------------------------------------------------------------------------------------- */

avisclient.get("/findone/:commentaire", (req, res) => {

    database.avisclient.findOne({

            where: {

                commentaire: req.params.commentaire

            }

        }).then(avisclient => {

            if (avisclient) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    avisclient: avisclient

                })
            } else {
                res.json({
                    error: "Avis Client n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

avisclient.get("/findAll", (req, res) => {

    database.avisclient.findAll({

            attributes: {
                include:[],
                exclude: []
            }

        }).then(avisclient => {

            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */

            res.json(avisclient)
        })
        .catch(err => {
            res.json("error" + err)
        })
});



module.exports= avisclient;