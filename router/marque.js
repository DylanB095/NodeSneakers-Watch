/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const marque = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------POST NOUVELLE MARQUE------------------------------------------------------------------------------------------------- */

marque.post("/NewMarque", (req, res) =>{
    const InfoMarque = {
        marque: req.body.marque
    }
    database.marque.findOne({
        where:{marque: req.body.marque}
    })
    .then(marque =>{
        if(!marque){
            database.marque.create(InfoMarque)
            .then(marque =>{
                res.json(marque)
            })
            .catch(err => {
                res.json({
                    error:"Marque non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Marque deja postée "
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

marque.get("/findone/:id", (req, res) => {
    database.marque.findOne({
            where: {
                id: req.params.id
            }
        }).then(marque => {
            if (marque) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    marque: marque
                })
            } else {
                res.json({
                    error: " La marque n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

marque.get("/findAll", (req, res) => {
    database.marque.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(marque => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(marque)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

marque.post("/MAJMarque", (req,res) =>{
    database.marque.findOne({
        where: {id: req.body.id}
    })
    .then(marque => {
        if(marque) {
            marque.update({
                marque: req.body.marque,
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

marque.delete("/SUP/:id", (req,res) => {
    database.marque.findOne({
        where: { id:req.params.id}
    })
    .then(marque => {
        if(marque){
            marque.destroy()
            .then(() => {
                res.json("Marque Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette marque, elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= marque;