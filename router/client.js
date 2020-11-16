/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande client adressée à un noeud final particulier, 
// à savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const client = express.Router();

// jsonwebtoken : un paquet de jetons Web JSON pour gérer l'authentification de l'utilisateur
const jwt = require('jsonwebtoken');

// bcrypt est une fonction de hachage de mot de passe ( Pour crypt le mot de passe)
const bcrypt = require('bcrypt');

const database = require('../database/database');

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Nodemailer est un module pour les applications Node.js qui permet d’envoyer des emails en toute simplicité.
const nodemailer = require('nodemailer')

// Ce module est un plugin de transport pour Nodemailer qui permet d’envoyer via l’API Web de SendGrid 
/* const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
})) */

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/* La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// La process.env propriété retourne un objet contenant l'environnement utilisateur
// On lui donne un Secret_key qui vas nous servir plutard pour signe si le token 
process.env.SECRET_KEY = "RS9";

/* ---------------------------------------------------------------- REGISTER ---------------------------------------------------------------- */

// Création du chemin, req qui contiendra toutes les valeur envoyé depuis le site internet

client.post("/register", (req, res) => {

    console.log(req.body)
    const Infoclient = {

        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        telephone: req.body.telephone,
        adresse: req.body.adresse,
        code_postal: req.body.code_postal,
        ville: req.body.ville,
        /* pays: req.body.pays, */
        password: req.body.password,

    };

    // On vas verifier a partir de sont email
    database.client.findOne({
            where: {
                email: req.body.email
            }
        })
        // Ensuite tu me retourne client
        .then(client => {
            if (!client) {

                // Le salt 10 , un script de 10 caracteres au debut 
                // du cryptage puis de 45 autre caracteres voir plus.
                //  la je lui demande de me hacher mon mdp en le fesant etape par etape
                const hash = bcrypt.hashSync(Infoclient.password, 10);

                // Je réaffecte le resultat précédent dans Infoclient.password avant qu'il soit envoyé dans la database
                Infoclient.password = hash;
                database.client.create(Infoclient)
                    .then(client => {

                        console.log(client)

                        nodemailer.createTransport({
                            host: 'mail.sneakers-watch.fr.',
                            port: 587,
                            secure: false,
                            auth: {
                                user: "contact@sneakers-watch.fr",
                                pass: "OVHcloudsneakerswatch",
                            },
                            tls: {
                                // ne pas échouer sur les certificats non valides
                                rejectUnauthorized: false
                            }
                        });

                        transporter.sendMail({

                                to: req.body.email,
                                from: 'contact@sneakers-watch.fr',
                                subject: 'Confirmation inscription à Sneakers Watch',
                                html: `
                
                            <div  style="height:500px; width: 100%; background-image: url(https://www.cjoint.com/doc/20_09/JInrmwR8Uvx_cqNgx7LQoc.jpg); background-size: cover; background-position: center; background-repeat: no-repeat;">
                            <div>
  
                            <br> <br>
                                <div>
                                    <h1 style=" font-family: 'Times New Roman'; font-weight: bold; text-align: center;font-size: 26px; color:#ff4949;">  Bienvenue Sur Notre Site, Sneakers Watch  </h1>
                                </div>
                            </div>
                           
                                 <br>
                                    <br>
                                    <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >Vous avez reçu ce courriel parce que vous vous  êtes récemment inscrit à nos site Sneakers Watch , veuillez trouvez ci-dessous votre identifiant
                                    </h3>
                                    <br>
                                    <br>
                                    <p style=" text-align: center;" >
                                    <span style="color:#ff4949;">- Identifiant </span>: ${req.body.email} 
                                    </p> 
                                    <br> 
                                    <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >Merci et à très bientôt    <br>   <br>   <br> <img src="https://www.cjoint.com/doc/20_09/JInpYq3gpvx_logo-sneakers-watch.png" width="100"; ></h3>
                                  
                                    
                                   
                                   
                                    </div>`
                            })
                            // je cree la signature de mon token en lui donnant mon secret_key=RS9
                        let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        // Je recupere le token
                        /**
                         * il envoie la reponse en json
                         */
                        res.json({
                            token: token
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "Le client existe déjà"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});

/* ---------------------------------------------------------------- Login ---------------------------------------------------------------- */

client.post("/login", (req, res) => {

    console.log(req.body)

    database.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {

            if (client) {

                // tu me compare le mot de passe entre et celui qui est dans ma base de donner
                if (bcrypt.compareSync(req.body.password, client.password)) {

                    //  Nous créons un jeton d'authentification pour l'utilisateur avec le jwt
                    let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                    // Je recupere le token
                    // tu m'envoie statu 200 si ses bon 
                    res.status(200.).json({
                        token: token
                    })
                } else {
                    res.status(404).send('message erreur ou mot de passe erreur')
                }
            } else {
                res.status(404).json("error client not found")
            }
        })
        .catch(err => {
            res.status(404).send('error ' + err)
        })

});

/* ---------------------------------------------------------------- Get findOne  ---------------------------------------------------------------- */

client.get("/findone/:email", (req, res) => {
    database.client.findOne({
            where: {
                email: req.params.email
            }
        }).then(client => {
            if (client) {
                /**
                 * fait reference au express.router
                 * il envoie la reponse en json
                 */
                res.json({
                    client: client
                })
            } else {
                res.json({
                    error: "le client n'existe pas dans la liste"
                })
            }
        })
        .catch(err => {
            res.json("error" + err);

        })
});

/* ---------------------------------------------------------------- Get findAll  ---------------------------------------------------------------- */

client.get("/findAll", (req, res) => {
    database.client.findAll({
            attributes: {
                include: [],
                exclude: ["password"]
            }
        }).then(client => {
            /**
             * fait reference au express.router
             * il envoie la reponse en json
             */
            res.json(client)
        })
        .catch(err => {
            res.json("error" + err)
        })
});

/* ---------------------------------------------------------------- Envoie Email  ---------------------------------------------------------------- */

client.post("/EnvoieDeMailChangement", (req, res) => {

    console.log(req.body.email)

    database.client.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(client => {
            if (client) {

                console.log(client)

                nodemailer.createTransport({
                    host: 'mail.sneakers-watch.fr.',
                    port: 587,
                    secure: false,
                    auth: {
                        user: "contact@sneakers-watch.fr",
                        pass: "OVHcloudsneakerswatch",
                    },
                    tls: {
                        // ne pas échouer sur les certificats non valides
                        rejectUnauthorized: false
                    }
                });

                transporter.sendMail({

                    to: req.body.email,
                    from: 'contact@sneakers-watch.fr',
                    subject: 'Modification Mot de Passe',
                    html: `
        
                    <div  style="height:500px; width: 100%; background-image: url(https://www.cjoint.com/doc/20_09/JInrmwR8Uvx_cqNgx7LQoc.jpg); background-size: cover; background-position: center; background-repeat: no-repeat;">
                    <div>

                    <br> <br>
                        <div>
                            <h1 style=" font-family: 'Times New Roman'; font-weight: bold; text-align: center;font-size: 38px; color:#ff4949;"> Sneakers Watch  </h1>
                        </div>
                    </div>
                   
                         <br>
                            <br>
                            <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >Vous avez reçu ce courriel parce que vous souhaitez changer de mot de passe, veuillez trouver ci-dessous le lien vous permettant de changer de mot de passe
                            </h3>
                            <br>
                            <br>
                            <p style=" text-align: center;" >
                            <span style="color:#ff4949;"><a href="#"> Cliquez ici</a> </span>
                            </p> 
                            <br> 
                            <h3 style="color:#DCDCDC; text-align:center; font-size: 14px; font-weight: bold;" >Merci et à très bientôt    <br>   <br>   <br> <img src="https://www.cjoint.com/doc/20_09/JInpYq3gpvx_logo-sneakers-watch.png" width="100"; ></h3>
                          
                            </div>`
                })
            } else {
                res.json({
                    error: "Cet Email est introuvable"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

/* ------------------------------------------------------- UPDATE MOT DE PASSE OUBLIE -------------------------------------------------------------------- */

client.post("/MdpModification", (req, res) => {

    database.client.findOne({
        where: {
            email: req.body.email
        }
    })

    .then(client => {
            if (client) {

                const hash = bcrypt.hashSync(req.body.password, 10);

                client.update({
                    email: req.body.email,
                    password: hash
                })
            } else {
                res.json({
                    error: "Le Mdp ne peux pas etre modifier"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

/* ---------------------------------------------------------------- UPDATE ---------------------------------------------------------------------- */

client.post("/MAJClient", (req, res) => {

    database.client.findOne({

        where: { email: req.body.email }

    })

    .then(client => {
            if (client) {

                client.update({

                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    telephone: req.body.telephone,
                    adresse: req.body.adresse,
                    code_postal: req.body.code_postal,
                    ville: req.body.ville,
                    /* pays: req.body.pays, */
                    password: req.body.password,

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

/* ---------------------------------------------------------------- DELETE ------------------------------------------------------------------------------------- */

client.delete("/SUP/:email", (req, res) => {

    database.client.findOne({
        where: { email: req.params.email }
    })

    .then(client => {

            if (client) {

                client.destroy()
                    .then(() => {

                        res.json("client Supprimé")
                    })

                .catch(err => {
                    res.json("error" + err)
                })

            } else {
                res.json({
                    error: "Vous ne pouvez pas supprimé ce client il n'existe pas dans la database"
                })
            }
        })
        .catch(err => {
            res.json("error" + err)
        })
})


module.exports = client;