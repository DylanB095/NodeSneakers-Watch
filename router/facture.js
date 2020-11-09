/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const facture = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- POST NOUVELLE FACTURE ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

facture.post("/Newfacture", (req, res) => {

    console.log(req.body)

    const InfoFacture = {
        id: req.body.id,
        date: req.body.date,
        heure: req.body.heure,

    }
    database.facture.findOne({

            where: {
                id: req.body.id
            }

        })
        .then(facture => {

            if (!facture) {

                database.facture.create(InfoFacture)

                    .then(facture => {

                        res.json(facture)

                    })
                    .catch(err => {
                        res.json({
                            error: "Facture non crée" + err
                        })
                    })
            } else {
                res.json({
                    error: "Facture est deja créé "
                })
            }
        })
        .catch(err => {
            res.json({
                error: "erreur" + err
            })
        })
})

/* --------------------------------------- Get findOne ---------------------------------------------------------------------------------------------- */

facture.get("/findone/:id", (req, res) => {

    database.facture.findOne({

            where: {

                id: req.params.id

            }

        }).then(facture => {

            if (facture) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    facture: facture

                })
            } else {
                res.json({
                    error: "Facture n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* --------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

facture.get("/findAll", (req, res) => {

    database.facture.findAll({

            attributes: {
                include: [],
                exclude: []
            }

        }).then(facture => {

            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */

            res.json(facture)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* ----------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

facture.post("/MAJFacture", (req, res) => {

    database.facture.findOne({

            where: {
                id: req.body.id
            }
        })
        .then(facture => {

            if (facture) {

                facture.update({
                    id: req.body.id,
                    date: req.body.date,
                    heure: req.body.heure,
                })
            } else {
                res.json({
                    error: "Mise a jour non effectuée"
                })
            }
        })
        .catch(err => {
            res.json('error' + err)
        })
})

/* ----------------------------------------- DELETE --------------------------------------------------------------------------------------------- */

facture.delete("/SUP/:id", (req, res) => {

    database.facture.findOne({
            where: {
                id: req.params.id
            }
        })

        .then(facture => {

            if (facture) {

                facture.destroy()
                    .then(() => {

                        res.json("Facture Supprimé")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({
                    error: "Vous ne pouvez pas supprimé cette facture elle n'existe pas dans la database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err)
        })
})


module.exports = facture;