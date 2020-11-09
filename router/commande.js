/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const commande = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- POST NOUVELLE COMMANDE ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

commande.post("/Newcommande", (req, res) =>{

    console.log(req.body)

    const InfoCommande = {

        date: req.body.date,

    }
    database.commande.findOne({

        where:{date: req.body.date}

    })
    .then(commande =>{

        if(!commande){

            database.commande.create(InfoCommande)

            .then(commande =>{

                res.json(commande)

            })
            .catch(err => {
                res.json({
                    error:"Commande non crée" + err
                })
            })
        }
        else{
            res.json({
                error:"Commande est deja créé "
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

commande.get("/findone/:date", (req, res) => {

    database.commande.findOne({

            where: {

                date: req.params.date

            }

        }).then(commande => {

            if (commande) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    commande: commande

                })
            } else {
                res.json({
                    error: "Commande n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* --------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

commande.get("/findAll", (req, res) => {

    database.commande.findAll({

            attributes: {
                include:[],
                exclude: []
            }

        }).then(commande => {

            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */

            res.json(commande)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* ----------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

commande.post("/MAJCommande", (req,res) =>{

    database.commande.findOne({

        where: {date: req.body.date}
    })
    .then(commande => {

        if(commande) {

            commande.update({
                date: req.body.date,
            })
        }
        else {
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

commande.delete("/SUP/:date", (req,res) => {

    database.commande.findOne({
        where: { date:req.params.date}
    })

    .then(commande => {

        if(commande){

            commande.destroy()
            .then(() => {

                res.json("Commande Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette commande elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= commande;