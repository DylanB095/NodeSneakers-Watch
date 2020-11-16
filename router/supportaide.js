/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande newsletter adressée à un noeud final particulier, 
// Ã  savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const supportaide = express.Router();


const database = require('../database/database');

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Nodemailer est un module pour les applications Node.js qui permet d'envoyer des emails en toute simplicitée.
const nodemailer = require('nodemailer')

// Ce module est un plugin de transport pour Nodemailer qui permet d'envoyer via l'API Web de SendGrid 
/* const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
})) */
const transporter = nodemailer.createTransport({
    host: 'mail.sneakers-watch.fr.',
    port: 587,
    secure: false,
    auth: {
        user: "contact@sneakers-watch.fr",
        pass: "OVHcloudsneakerswatch",
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/*  La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ------------------------------------------------------------------------------------------------------------------------------------------ */


/* ---------------------------------------------------------------- supportachat  ---------------------------------------------------------------- */

supportaide.post("/ContacterSppAide", (req, res) => {

    console.log(req.body)

    const Infosupportaide = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        motif_de_contact: req.body.motif_de_contact,
        message: req.body.message

    }

    database.supportaide.findOne({
        where: { email: req.body.email }
    })

    .then(supportaide => {
            console.log(supportaide)

            if (!supportaide) {

                database.supportaide.create(Infosupportaide)

                .then(supportaide => {
                    console.log(supportaide)

                    transporter.sendMail({

                        to: 'contact@sneakers-watch.fr',
                        from: 'contact@sneakers-watch.fr',
                        subject: 'Notification - Requête Support Daide',
                        html: `
        
                    <div  style="height:100%; width: 100%; background-image: url(https://www.cjoint.com/doc/20_09/JInrmwR8Uvx_cqNgx7LQoc.jpg); background-size: cover; background-position: center; background-repeat: no-repeat;">
                    <div>

                    <br> <br>
                        <div>
                            <h1 style=" font-family: 'Times New Roman'; font-weight: bold; text-align: center;font-size: 38px; color:#ff4949;"> Sneakers Watch  </h1>
                        </div>
                    </div>
                   
                         <br>
                            <br>
                            <h3 style="color:#DCDCDC; text-align:center; font-family: 'Times New Roman'; font-size: 18px; font-weight: bold;" > Sneakers Watch , nous vous informons l'enregistrement d'une requête au support d'aide de votre site E-commerce.<br>
                            Vous retrouverez ci-dessous les informations de contact concernant celui-ci :
                            </h3>
                            <br>
                            <br>
                            <br>
                            <p  style=" margin-left:75px; font-family: 'Times New Roman'; color:#DCDCDC;" >
                            <span style="color:#ff4949">NOM:</span> ${req.body.nom}<br>
                            <span style="color:#ff4949">PRENOM:</span> ${req.body.prenom}<br>
                            <span style="color:#ff4949">EMAIL:</span> ${req.body.email}<br>
                            <span style="color:#ff4949">MOTIF DE CONTACT:</span> ${req.body.motif_de_contact}<br>
                            <span style="color:#ff4949">MESSAGE:</span> ${req.body.message}
                            </p> 
                            <br> 
                            <h3 style="color:#DCDCDC; text-align:center; font-family: 'Times New Roman'; font-size: 18px; font-weight: bold;" >Merci et à très bientôt    <br>   <br>  <img src="https://www.cjoint.com/doc/20_09/JInpYq3gpvx_logo-sneakers-watch.png" width="100"; ></h3>
                          
                            </div>`
                    })
                    res.json(supportaide)
                })
            } else {
                res.json({
                    error: "Requête support d aide dejà enregistrer"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "erreur" + err
            })
        })
})


module.exports = supportaide;