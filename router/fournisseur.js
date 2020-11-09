/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const fournisseur = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ----------------------------------------------POST NOUVEAU FOURNISSEUR----------------------------------------------------------------------------------------------- */


fournisseur.post("/NewFournisseur", (req, res) =>{
    const InfoFournisseur = {
        nom: req.body.nom
    }
    database.fournisseur.findOne({
        where:{nom: req.body.nom}
    })
    .then(fournisseur =>{
        if(!fournisseur){
            database.fournisseur.create(InfoFournisseur)
            .then(fournisseur =>{
                res.json(fournisseur)
            })
            .catch(err => {
                res.json({
                    error:"Fournisseur non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Fournisseur deja postée "
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

fournisseur.get("/findone/:id", (req, res) => {
    database.fournisseur.findOne({
            where: {
                id: req.params.id
            }
        }).then(fournisseur => {
            if (fournisseur) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    fournisseur: fournisseur
                })
            } else {
                res.json({
                    error: " Le fournisseur n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

fournisseur.get("/findAll", (req, res) => {
    database.fournisseur.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(fournisseur => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(fournisseur)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

fournisseur.post("/MAJFournisseur", (req,res) =>{
    database.fournisseur.findOne({
        where: {id: req.body.id}
    })
    .then(marque => {
        if(marque) {
            marque.update({
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

fournisseur.delete("/SUP/:id", (req,res) => {
    database.fournisseur.findOne({
        where: { id:req.params.id}
    })
    .then(fournisseur => {
        if(fournisseur){
            fournisseur.destroy()
            .then(() => {
                res.json("Fournisseur Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé ce fournisseur, il n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= fournisseur;