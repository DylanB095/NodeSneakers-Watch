/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const livraison = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ----------------------------------------------POST NOUVELLE LIVRAISON ----------------------------------------------------------------------------------------------- */

livraison.post("/NewLivraison", (req, res) =>{
    const InfoLivraison = {
        type_livraison: req.body.type_livraison,
        numero_de_suivit: req.body.numero_de_suivit
    }
    database.livraison.findOne({
        where:{numero_de_suivit: req.body.numero_de_suivit}
    })
    .then(livraison =>{
        if(!livraison){
            database.livraison.create(InfoLivraison)
            .then(livraison =>{
                res.json(livraison)
            })
            .catch(err => {
                res.json({
                    error:"Livraison non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Livraison deja postée "
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

livraison.get("/findone/:numero_de_suivit", (req, res) => {
    database.livraison.findOne({
            where: {
                numero_de_suivit: req.params.numero_de_suivit
            }
        }).then(livraison => {
            if (livraison) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    livraison: livraison
                })
            } else {
                res.json({
                    error: " La livraison n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

livraison.get("/findAll", (req, res) => {
    database.livraison.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(livraison => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(livraison)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

livraison.post("/MAJLivraison", (req,res) =>{
    database.livraison.findOne({
        where: {numero_de_suivit: req.body.numero_de_suivit}
    })
    .then(livraison => {
        if(livraison) {
            livraison.update({
                type_livraison: req.body.type_livraison,
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

livraison.delete("/SUP/:numero_de_suivit", (req,res) => {
    database.livraison.findOne({
        where: { numero_de_suivit:req.params.numero_de_suivit}
    })
    .then(livraison => {
        if(livraison){
            livraison.destroy()
            .then(() => {
                res.json("Livraison Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette livraison, elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= livraison;