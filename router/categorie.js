/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const categorie = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------POST NOUVELLE CATEGORIE----------------------- */

categorie.post("/NewCategorie", (req, res) =>{
    const InfoCategorie = {
        nom_categories: req.body.nom_categories
    }
    database.categorie.findOne({
        where:{nom_categories: req.body.nom_categories}
    })
    .then(categorie =>{
        if(!categorie){
            database.categorie.create(InfoCategorie)
            .then(categorie =>{
                res.json(categorie)
            })
            .catch(err => {
                res.json({
                    error:"Categorie non crée" + err
                })
            })
        }
        else{
            res.json({
                error:"Categorie est deja créé "
            })
        }
    })
    .catch(err => {
        res.json({
            error: "erreur" + err
        })
    })
})

/* ------------------------------------- Get findOne ------------------------------ */

categorie.get("/findone/:nom_categories", (req, res) => {
    database.categorie.findOne({
            where: {
                nom_categories: req.params.nom_categories
            }
        }).then(categorie => {
            if (categorie) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    categorie: categorie
                })
            } else {
                res.json({
                    error: "Categorie n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

categorie.get("/findAll", (req, res) => {
    database.categorie.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(categorie => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(categorie)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

categorie.post("/MAJCategorie", (req,res) =>{
    database.categorie.findOne({
        where: {id: req.body.id}
    })
    .then(categorie => {
        if(categorie) {
            categorie.update({
                nom_categories: req.body.nom_categories
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

categorie.delete("/SUP/:nom_categories", (req,res) => {
    database.categorie.findOne({
        where: { nom_categories:req.params.nom_categories}
    })
    .then(categorie => {
        if(categorie){
            categorie.destroy()
            .then(() => {
                res.json("Categorie Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette categorie elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= categorie;