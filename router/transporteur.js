/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const transporteur = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ------------------------------------------------POST NOUVELLE TRANSPORTEUR--------------------------------------------------------------------------------------------- */

transporteur.post("/NewTransporteur", (req, res) =>{
    const InfoTransporteur = {
        nom: req.body.nom,
    }
    database.transporteur.findOne({
        where:{nom: req.body.nom}
    })
    .then(transporteur =>{
        if(!transporteur){
            database.transporteur.create(InfoTransporteur)
            .then(transporteur =>{
                res.json(transporteur)
            })
            .catch(err => {
                res.json({
                    error:"Transporteur non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Transporteur deja postée "
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

transporteur.get("/findone/:id", (req, res) => {
    database.transporteur.findOne({
            where: {
                id: req.params.id
            }
        }).then(transporteur => {
            if (transporteur) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    transporteur: transporteur
                })
            } else {
                res.json({
                    error: " Le transporteur n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

transporteur.get("/findAll", (req, res) => {
    database.transporteur.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(transporteur => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(transporteur)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

transporteur.post("/MAJTransporteur", (req,res) =>{
    database.transporteur.findOne({
        where: {id: req.body.id}
    })
    .then(transporteur => {
        if(transporteur) {
            transporteur.update({
                nom: req.body.nom,
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

/* -------------------------------------- DELETE --------------------------------------------------------------------------------------------- */

transporteur.delete("/SUP/:id", (req,res) => {
    database.transporteur.findOne({
        where: { id:req.params.id}
    })
    .then(transporteur => {
        if(transporteur){
            transporteur.destroy()
            .then(() => {
                res.json("Transporteur Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé ce transporteur, il n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= transporteur;