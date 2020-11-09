/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const adresselivraison = express.Router();

const database = require('../database/database');

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------- POST NOUVELLE ADRESSE-LIVRAISON ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

adresselivraison.post("/Newadresselivraison", (req, res) =>{
    console.log(req.body)
    const InfoAdresseLivraison = {

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
    database.adresselivraison.findOne({

        where:{email: req.body.email}

    })
    .then(adresselivraison =>{

        if(!adresselivraison){

            database.adresselivraison.create(InfoAdresseLivraison)

            .then(adresselivraison =>{

                res.json(adresselivraison)

            })
            .catch(err => {
                res.json({
                    error:"Adresse Livraison non crée" + err
                })
            })
        }
        else{
            res.json({
                error:"Adresse Livraison est deja créé "
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

adresselivraison.get("/findone/:nom", (req, res) => {

    database.adresselivraison.findOne({

            where: {

                nom: req.params.nom

            }

        }).then(adresselivraison => {

            if (adresselivraison) {

                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */

                res.json({

                    adresselivraison: adresselivraison

                })
            } else {
                res.json({
                    error: "Adresse Livraison n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

adresselivraison.get("/findAll", (req, res) => {

    database.adresselivraison.findAll({

            attributes: {
                include:[],
                exclude: ["email"]
            }

        }).then(adresselivraison => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(adresselivraison)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

adresselivraison.post("/MAJAdresseLivraison", (req,res) =>{

    database.adresselivraison.findOne({

        where: {email: req.body.email}
    })
    .then(adresselivraison => {

        if(adresselivraison) {

            adresselivraison.update({

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

adresselivraison.delete("/SUP/:email", (req,res) => {

    database.adresselivraison.findOne({

        where: { email:req.params.email}

    })
    .then(adresselivraison => {
        if(adresselivraison){
            adresselivraison.destroy()
            .then(() => {
                res.json("Adresse Livraison Supprimé")
            })
            .catch(err => {
                res.json("error" + err)
            })
        } 
        else {
            res.json({
                error:"Vous ne pouvez pas supprimé cette adresse de livraison elle n'existe pas dans la database"
            })
        }
    })
    .catch(err => {
        res.json("error" + err)
    })
})



module.exports= adresselivraison;