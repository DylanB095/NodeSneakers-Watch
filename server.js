/* ------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * ExpressJS est une librairie qui vous permettra de créer 
 * une application Web plus simplement qu'avec l'objet http directement.
 */
const express = require("express");

// body-parser : un paquet permettant de lire les données JSON envoyées à notre serveur.
const bodyParser = require("body-parser");

//  CORS est un mécanisme de sécurité qui bloque certaines requêtes non autorisées à votre serveur Web.
const cors = require("cors");

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// require router
const client = require("./router/client");
const produit = require("./router/produit");
const adressefacturation = require("./router/adressefacturation");
const adresselivraison = require("./router/adresselivraison");
const avisclient = require("./router/avisclient");
const commande = require("./router/commande");
const enchere = require("./router/enchere");
const facture = require("./router/facture");
const reduction = require("./router/reduction"); 
const taille = require("./router/taille"); 
const marque = require("./router/marque"); 
const categorie = require("./router/categorie"); 
const fournisseur = require("./router/fournisseur"); 
const livraison = require("./router/livraison"); 
const transporteur = require("./router/transporteur"); 
const formulaire = require("./router/formulaire");
const newsletter = require("./router/newsletter");
const supportachat = require("./router/supportachat");
const supportaide = require("./router/supportaide");

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Le port sur lequel vous pouvez appeler pour utiliser votre serveur en local
// en nodejs 3000 est le port par defaut

const port = process.env.PORT || 3000;

// app = express
const app = express();

// Dans notre application, nous utilisons cors
app.use(cors());

// Dans notre application, nous utilisons bodyParser en json
app.use(bodyParser.json());

// les valeur peux etre en string ou en objet
// Si extended c'est le cas true, vous pouvez faire ce que vous voulez.
//urlencoded est un mécanisme de codage de l'information dans un Uniform Resource Identifier (URI) 
app.use(bodyParser.urlencoded({extended: false}));

// Nous allons alors prixfix pour nos itinéraires
app.use("/client", client);
app.use("/produit", produit);
app.use("/adressefacturation", adressefacturation);
app.use("/adresselivraison", adresselivraison);
app.use("/avisclient", avisclient);
app.use("/commande", commande);
app.use("/enchere", enchere);
app.use("/facture", facture);
app.use("/reduction", reduction);
app.use("/taille", taille);
app.use("/marque", marque);
app.use("/categorie", categorie);
app.use("/fournisseur", fournisseur);
app.use("/livraison", livraison);
app.use("/transporteur", transporteur);
app.use("/formulaire", formulaire);
app.use("/newsletter", newsletter);
app.use("/supportachat", supportachat);
app.use("/supportaide", supportaide)



// Nous disons à notre application de commencer à écouter le port et de nous 
// renvoyer le message contenant les informations sur le port
app.listen(port, function () {
    console.log("Mon server fonctionne sur " + port)
});
