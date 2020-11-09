/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require('express');

//// Le routage consiste à déterminer comment une application répond à une demande newsletter adressée à un noeud final particulier, 
// Ã  savoir un URI (ou chemin) et une méthode de requête HTTP spécifique (GET, POST, etc.).

const supportachat = express.Router();


const database = require('../database/database');

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Nodemailer est un module pour les applications Node.js qui permet d'envoyer des emails en toute simplicitée.
const nodemailer = require('nodemailer')

// Ce module est un plugin de transport pour Nodemailer qui permet d'envoyer via l'API Web de SendGrid 
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/*  La définition d'itinéraire prend la structure suivante:
 * GET : La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET doivent uniquement extraire des données et ne doivent avoir aucun autre effet.
 * POST : La méthode POST demande au serveur d'accepter l'entité incluse dans la demande en tant que nouveau subordonné de la ressource Web identifiée par l'URI. 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * UPDATE : La méthode UPDATE permet de mettre a jour quelque element.
 */

/* ------------------------------------------------------------------------------------------------------------------------------------------ */


/* ---------------------------------------------------------------- supportachat  ---------------------------------------------------------------- */

supportachat.post("/ContacterSppAchat", (req, res) =>{

    console.log(req.body)

    const Infosupportachat = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        telephone: req.body.telephone

    }

    database.supportachat.findOne({
        where:{email: req.body.email}
    })
    
    .then(supportachat =>{
        console.log(supportachat)

        if(!supportachat){

            database.supportachat.create(Infosupportachat)

            .then(supportachat =>{
                console.log(supportachat)

                transporter.sendMail({

                    to: 'sneakers.w0atch@gmail.com',
                    from: 'sneakers.w0atch@gmail.com',
                    subject: 'Notification - Requête Support Assistance Dachat',
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
                            <h3 style="color:#DCDCDC; text-align:center; font-family: 'Times New Roman'; font-size: 18px; font-weight: bold;" > Sneakers Watch , nous vous informons l'enregistrement d'une requête au support d'assistance d'achat de votre site E-commerce.<br>
                            Vous retrouverez ci-dessous les informations de contact concernant celui-ci :
                            </h3>
                            <br>
                            <br>
                            <br>
                            <p  style=" text-align: center; font-family: 'Times New Roman'; color:#DCDCDC;" >
                            <span style="color:#ff4949">NOM:</span> ${req.body.nom}<br>
                            <span style="color:#ff4949">PRENOM:</span> ${req.body.prenom}<br>
                            <span style="color:#ff4949">EMAIL:</span> ${req.body.email}<br>
                            <span style="color:#ff4949">TEL:</span> ${req.body.telephone}
                            </p> 
                            <br> 
                            <h3 style="color:#DCDCDC; text-align:center; font-family: 'Times New Roman'; font-size: 18px; font-weight: bold;" >Merci et à très bientôt    <br>   <br>  <img src="https://www.cjoint.com/doc/20_09/JInpYq3gpvx_logo-sneakers-watch.png" width="100"; ></h3>
                          
                            </div>`
                })
                res.json(supportachat)
            })
        }
        else{
            res.json({
                error:"Requête support d achat dejà enregistrer"
            })
        }
    })
    .catch(err => {
        res.json({
            error: "erreur" + err
        })
    })
})


module.exports = supportachat;