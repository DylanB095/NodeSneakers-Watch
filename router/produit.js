/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).
const produit = express.Router();

const database = require('../database/database');

/* Le where option est utilisée pour filtrer la requête. Il existe de nombreux opérateurs à utiliser pour la whereclause, disponibles sous forme de symboles à partir de Op. */
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* --------------------------------------------------------------------------------------------------------------------------------------------- */


/* ------------------------------------- POST NOUVEAU PRODUIT ---------------------------------------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

produit.post("/Newproduit", (req, res) => {
    const InfoProduit = {
        nom: req.body.nom,
        description: req.body.description,
        image: req.body.image,
        prix_achat_immediat: req.body.prix_achat_immediat,
        reference: req.body.reference,
    }
    database.produit.findOne({
            where: { reference: req.body.reference }
        })
        .then(produit => {
            if (!produit) {
                database.produit.create(InfoProduit)
                    .then(produit => {
                        res.json(produit)
                    })
                    .catch(err => {
                        res.json({
                            error: "Produit non crée" + err
                        })
                    })
            } else {
                res.json({
                    error: "Produit est deja créé "
                })
            }
        })
        .catch(err => {
            res.json({
                error: "erreur" + err
            })
        })
})

/* ------------------------------------- Get Limit/Offset---------------------------------------------------------------------------------------------- */
produit.get("/all/:limit/:offset", (req, res) => {
    database.produit.findAll({
            limit: parseInt(req.params.limit),
            offset: parseInt(req.params.offset),
        })
        .then(produit => {
            if (produit) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    produit: produit
                })
            } else {
                res.json({
                    error: "Produits n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});
/* ------------------------------------- Get Limit---------------------------------------------------------------------------------------------- */
produit.get("/limit/:limit", (req, res) => {
    database.produit.findAll({
            attributes: {
                include: [],
            },
            limit: parseInt(req.params.limit),
        })
        .then(produit => {
            if (produit) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    produit: produit
                })
            } else {
                res.json({
                    error: "Produits n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});
/* ------------------------------------- Get findOne ---------------------------------------------------------------------------------------------- */

produit.get("/findone/:nom", (req, res) => {
    database.produit.findOne({
            where: {
                nom: req.params.nom
            }
        }).then(produit => {
            if (produit) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    produit: produit
                })
            } else {
                res.json({
                    error: "Produit n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* -------------------------------------- Get findAll  -------------------------------------------------------------------------------------------- */

produit.get("/findAll", (req, res) => {
    database.produit.findAll({
            attributes: {
                include: [],
                exclude: ["description"]
            }
        }).then(produit => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(produit)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* -------------------------------------- UPDATE --------------------------------------------------------------------------------------------- */

produit.post("/MAJProduit", (req, res) => {
    database.produit.findOne({
            where: { reference: req.body.reference }
        })
        .then(produit => {
            if (produit) {
                produit.update({
                    nom: req.body.nom,
                    description: req.body.description,
                    image: req.body.image,
                    prix_achat_immediat: req.body.prix_achat_immediat,
                })
            } else {
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

produit.delete("/SUP/:nom", (req, res) => {
    database.produit.findOne({
            where: { nom: req.params.nom }
        })
        .then(produit => {
            if (produit) {
                produit.destroy()
                    .then(() => {
                        res.json("Produit Supprimé")
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json({
                    error: "Vous ne pouvez pas supprimé ce produit il n'existe pas dans la database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err)
        })
})

/* --------------------------- GET INPUT RECHERCHE---------------------------------------------- */

produit.get("/Recherche/:nom", (req, res) => {
    database.produit.findAll({
            where: {
                nom: {
                    [Op.like]: '%' + req.params.nom + '%'
                }
            },
        })
        .then(produit => {
            if (produit) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    produit: produit
                })
            } else {
                res.json({
                    error: "Produit n'existe pas dans la Database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});


module.exports = produit;