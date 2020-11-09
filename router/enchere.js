/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const enchere = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- POST NOUVELLE ENCHERE ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

enchere.post("/Newenchere", (req, res) => {

    console.log(req.body)

    const InfoEnchere = {
        id: req.body.id,
        maximum_dix_surenchere: req.body.maximum_dix_surenchere,
        prix_surenchere: req.body.prix_surenchere,
        prix_minimum: req.body.prix_minimum,

    }
    database.enchere.findOne({

            where: {
                id: req.body.id
            }

        })
        .then(enchere => {

            if (!enchere) {

                database.enchere.create(InfoEnchere)

                    .then(enchere => {

                        res.json(enchere)

                    })
                    .catch(err => {
                        res.json({
                            error: "Enchere non crée" + err
                        })
                    })
            } else {
                res.json({
                    error: "Enchere est deja créé "
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

enchere.get("/findone/:id", (req, res) => {

    database.enchere.findOne({

            where: {

                id: req.params.id

            }

        }).then(enchere => {

            if (enchere) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    enchere: enchere

                })
            } else {
                res.json({
                    error: "Enchere n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* --------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

enchere.get("/findAll", (req, res) => {

    database.enchere.findAll({

            attributes: {
                include: [],
                exclude: []
            }

        }).then(enchere => {

            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */

            res.json(enchere)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* ----------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

enchere.post("/MAJEnchere", (req, res) => {

    database.enchere.findOne({

            where: {
                id: req.body.id
            }
        })
        .then(enchere => {

            if (enchere) {

                enchere.update({
                    id: req.body.id,
                    maximum_dix_surenchere: req.body.maximum_dix_surenchere,
                    prix_surenchere: req.body.prix_surenchere,
                    prix_minimum: req.body.prix_minimum,
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

enchere.delete("/SUP/:id", (req, res) => {

    database.enchere.findOne({
            where: {
                id: req.params.id
            }
        })

        .then(enchere => {

            if (enchere) {

                enchere.destroy()
                    .then(() => {

                        res.json("Enchere Supprimé")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({
                    error: "Vous ne pouvez pas supprimé cette enchere elle n'existe pas dans la database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err)
        })
})


module.exports = enchere;