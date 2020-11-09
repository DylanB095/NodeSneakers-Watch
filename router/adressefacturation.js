/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const adressefacturation = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------- POST NOUVELLE ADRESSE-FACTURATION ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

adressefacturation.post("/Newadressefacturation", (req, res) =>{
    console.log(req.body)
    const InfoAdressefacturation = {

        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        telephone: req.body.telephone,
        adresse: req.body.adresse,
        code_postal: req.body.code_postal,
        ville: req.body.ville,
        /* pays: req.body.pays, */
        adresse_complementaire: req.body.adresse_complementaire

    }
    database.adressefacturation.findOne({

        where:{email: req.body.email}

    })
    .then(adressefacturation =>{

        if(!adressefacturation){

            database.adressefacturation.create(InfoAdressefacturation)

            .then(adressefacturation =>{

                res.json(adressefacturation)

            })
            .catch(err => {
                res.json({
                    error:"Adresse Facturation non crée" + err
                })
            })
        }
        else{
            res.json({
                error:"Adresse Facturation est deja créé "
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

adressefacturation.get("/findone/:nom", (req, res) => {

    database.adressefacturation.findOne({

            where: {

                nom: req.params.nom

            }

        }).then(adressefacturation => {

            if (adressefacturation) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    adressefacturation: adressefacturation

                })
            } else {
                res.json({
                    error: "Adresse Facturation n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

adressefacturation.get("/findAll", (req, res) => {

    database.adressefacturation.findAll({

            attributes: {
                include:[],
                exclude: ["email"]
            }

        }).then(adressefacturation => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(adressefacturation)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

adressefacturation.post("/MAJAdressefacturation", (req,res) =>{

    database.adressefacturation.findOne({

        where: {email: req.body.email}
    })
    .then(adressefacturation => {

        if(adressefacturation) {

            adressefacturation.update({

                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                telephone: req.body.telephone,
                adresse: req.body.adresse,
                code_postal: req.body.code_postal,
                ville: req.body.ville,
                /* pays: req.body.pays, */
                adresse_complementaire: req.body.adresse_complementaire

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

adressefacturation.delete("/SUP/:email", (req,res) => {

    database.adressefacturation.findOne({

        where: { email:req.params.email}

    })
    .then(adressefacturation => {
        if(adressefacturation){
            adressefacturation.destroy()
            .then(() => {
                res.json("Adresse Facturation Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette adresse de facturation elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})



module.exports= adressefacturation;