/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const formulaire = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- POST NOUVEAU FORMULAIRE ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

formulaire.post("/Newformulaire", (req, res) => {

    console.log(req.body)

    const InfoFormulaire = {

        id: req.body.id,
        carte_identite: req.body.carte_identite,
        carte_bancaire: req.body.carte_bancaire,
        cvv: req.body.cvv,
        expiration: req.body.expiration,

    }
    database.formulaire.findOne({

            where: {
                id: req.body.id
            }

        })
        .then(formulaire => {

            if (!formulaire) {

                database.formulaire.create(InfoFormulaire)

                    .then(formulaire => {

                        res.json(formulaire)

                    })
                    .catch(err => {
                        res.json({
                            error: "Formulaire non crée" + err
                        })
                    })
            } else {
                res.json({
                    error: "Formulaire est deja créé "
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

formulaire.get("/findone/:id", (req, res) => {

    database.formulaire.findOne({

            where: {

                id: req.params.id

            }

        }).then(formulaire => {

            if (formulaire) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    formulaire: formulaire

                })
            } else {
                res.json({
                    error: "Formulaire n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* --------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

formulaire.get("/findAll", (req, res) => {

    database.formulaire.findAll({

            attributes: {
                include: [],
                exclude: []
            }

        }).then(formulaire => {

            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */

            res.json(formulaire)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* ----------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

formulaire.post("/MAJFormulaire", (req, res) => {

    database.formulaire.findOne({

            where: {
                id: req.body.id
            }
        })
        .then(formulaire => {

            if (formulaire) {

                formulaire.update({

                    id: req.body.id,
                    carte_identite: req.body.carte_identite,
                    carte_bancaire: req.body.carte_bancaire,
                    cvv: req.body.cvv,
                    expiration: req.body.expiration,
                    
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

formulaire.delete("/SUP/:id", (req, res) => {

    database.formulaire.findOne({
            where: {
                id: req.params.id
            }
        })

        .then(formulaire => {

            if (formulaire) {

                formulaire.destroy()
                    .then(() => {

                        res.json("Formulaire Supprimé")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({
                    error: "Vous ne pouvez pas supprimé ce formulaire il n'existe pas dans la database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err)
        })
})


module.exports = formulaire;