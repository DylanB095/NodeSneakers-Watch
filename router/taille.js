/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const taille = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ----------------------------------------POST NOUVELLE TAILLE----------------------------------------------------------------------------------------------------- */

taille.post("/NewTaille", (req, res) =>{
    const InfoTaille = {
        taille: req.body.taille
    }
    database.taille.findOne({
        where:{taille: req.body.taille}
    })
    .then(taille =>{
        if(!taille){
            database.taille.create(InfoTaille)
            .then(taille =>{
                res.json(taille)
            })
            .catch(err => {
                res.json({
                    error:"Taille non postée" + err
                })
            })
        }
        else{
            res.json({
                error:"Taille deja postée "
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

taille.get("/findone/:id", (req, res) => {
    database.taille.findOne({
            where: {
                id: req.params.id
            }
        }).then(taille => {
            if (taille) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    taille: taille
                })
            } else {
                res.json({
                    error: "La Taille n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

taille.get("/findAll", (req, res) => {
    database.taille.findAll({
            attributes: {
                include:[],
                exclude: []
            }
        }).then(taille => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(taille)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

taille.post("/MAJTaille", (req,res) =>{
    database.taille.findOne({
        where: {id: req.body.id}
    })
    .then(taille => {
        if(taille) {
            taille.update({
                taille: req.body.taille,
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

taille.delete("/SUP/:id", (req,res) => {
    database.taille.findOne({
        where: { id:req.params.id}
    })
    .then(taille => {
        if(taille){
            taille.destroy()
            .then(() => {
                res.json("Taille Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette taille, elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})


module.exports= taille;