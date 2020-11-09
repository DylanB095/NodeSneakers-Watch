/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const reduction = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------POST NOUVELLE REDUCTION------------------------------------------------------------------------------------------------- */

reduction.post("/NewReduction", (req, res) =>{
    const InfoReduction = {
        code_promo: req.body.code_promo
    }
    database.reduction.findOne({
        where:{code_promo: req.body.code_promo}
    })
    .then(reduction =>{
        if(!reduction){
            database.reduction.create(InfoReduction)
            .then(reduction =>{
                res.json(reduction)
            })
            .catch(err => {
                res.json({
                    error:"Reduction non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Reduction deja postée "
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

reduction.get("/findone/:id", (req, res) => {
    database.reduction.findOne({
            where: {
                id: req.params.id
            }
        }).then(reduction => {
            if (reduction) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    reduction: reduction
                })
            } else {
                res.json({
                    error: "La Reduction n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

reduction.get("/findAll", (req, res) => {
    database.reduction.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(reduction => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(reduction)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

reduction.post("/MAJReduction", (req,res) =>{
    database.reduction.findOne({
        where: {id: req.body.id}
    })
    .then(reduction => {
        if(reduction) {
            reduction.update({
                code_promo: req.body.code_promo,
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

reduction.delete("/SUP/:id", (req,res) => {
    database.reduction.findOne({
        where: { id:req.params.id}
    })
    .then(reduction => {
        if(reduction){
            reduction.destroy()
            .then(() => {
                res.json("Reduction Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette reduction, elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= reduction;