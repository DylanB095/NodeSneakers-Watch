/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Sequelize est un ORM
// ORM : Un mapping objet-relationnel 
// est un type de programme informatique qui se place en interface entre un programme applicatif 
// et une base de données relationnelle pour simuler une base de données orientée objet.

const Sequelize = require('sequelize'); 

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

// Faire ma const;
const database = {};

// Se connecter à la base de données
const ConnexionDb = new Sequelize("SnkrsWatch","root","root",{
    host: "localhost",
    // on precise le type de base de donne qu'on vas utilisé
    dialect: "mysql",
    pool:{
        // Taille maximale de connexion
        max:5, 
        // Taille minimale de connexion
        min:0, 
        // Lors de l'envoi de la requete, si au bout de tant de sec le server est bloqué,il renvoit la requete est fausse
        acquire: 30000,
        // Destruction de la connection si inactivité << Exemple : appli bancaire quand nous devons mettre le code envoie par sms >>
        idle: 500,
    }

});

ConnexionDb.authenticate()
    // if = (si ca marche)*/
    .then(() => {
        console.log('connection to database')
    })
    // else (si ça ne marche pas)
    // catch veut dire attraper 
    .catch(err => {
        console.error('unable to connect to the database:' + err)
    });

/* ------------------------------------------------------------------------------------------------------------------------------------------ */

//  Nécessite chaque table dans la base de données

database.adressefacturation = require ('../models/AdresseFacturation')(ConnexionDb,Sequelize);
database.adresselivraison = require ('../models/AdresseLivraison')(ConnexionDb,Sequelize);
database.avisclient = require ('../models/AvisClient')(ConnexionDb,Sequelize);
database.categorie = require ('../models/Categorie')(ConnexionDb,Sequelize);
database.client = require ('../models/Client')(ConnexionDb,Sequelize);
database.commande = require ('../models/Commande')(ConnexionDb,Sequelize);
database.comptedepot = require ('../models/CompteDepot')(ConnexionDb,Sequelize);
database.enchere = require ('../models/Enchere')(ConnexionDb,Sequelize);
database.facture = require ('../models/Facture')(ConnexionDb,Sequelize);
database.formulaire = require ('../models/Formulaire')(ConnexionDb,Sequelize);
database.fournisseur = require ('../models/Fournisseur')(ConnexionDb,Sequelize);
database.livraison = require ('../models/Livraison')(ConnexionDb,Sequelize);
database.marque = require ('../models/Marque')(ConnexionDb,Sequelize);
database.paiement = require ('../models/Paiement')(ConnexionDb,Sequelize);
database.produit = require ('../models/Produit')(ConnexionDb,Sequelize);
database.reduction = require ('../models/Reduction')(ConnexionDb,Sequelize);
database.transporteur = require ('../models/Transporteur')(ConnexionDb,Sequelize);
database.typepaiement = require ('../models/TypePaiement')(ConnexionDb,Sequelize);
database.taille = require ('../models/Taille')(ConnexionDb,Sequelize);
database.newsletter = require ('../models/Newsletter')(ConnexionDb,Sequelize);
database.supportachat = require ('../models/SupportAchat')(ConnexionDb,Sequelize);
database.supportaide = require ('../models/SupportAide')(ConnexionDb,Sequelize);

/* ------------------------------------------------------------------------------------------------------------------------------------------ */
//  1,N ET 0,N - 1/1 */

database.formulaire.hasMany(database.client,{foreignKey:'Formulaire'}); // formulaire 1/N client - cas contraire client 1/1 formulaire (donc l'Id formulaire va dans la table client (le N vers le plus petit ))
database.adresselivraison.hasMany(database.client,{foreignKey:'AdresseLivraison'}); // adresselivraison 1/N client - cas contraire client 1/1 adresselivraison (donc l'Id adresselivraison va dans la table client (le N vers le plus petit ))
database.adressefacturation.hasMany(database.client,{foreignKey:'AdresseFacturation'});// adressefacturation 1/N client - cas contraire client 1/1 adressefacturation (donc l'Id adressefacturation va dans la table client  (le N vers le plus petit ))
database.client.hasMany(database.avisclient,{foreignKey:'Client'});// client 0/N avis client - cas contraire avisclient 1/1 client (donc l'Id client va dans la table avisclient  (le N vers le plus petit ))
database.client.hasMany(database.commande,{foreignKey:'Client'});// client 1/N commande - cas contraire commande 1/1 client (donc l'Id client va dans la table commande  (le N vers le plus petit ))
database.produit.hasMany(database.avisclient,{foreignKey:'Produit'});// produit 1/N avis client - cas contraire avisclient 1/1 produit (donc l'Id produit va dans la table avisclient  (le N vers le plus petit ))
database.marque.hasMany(database.produit,{foreignKey:'Marque'}); // marque 1/N produit - cas contraire produit 1/1 marque (donc l'Id marque va dans la table produit  (le N vers le plus petit ))
database.reduction.hasMany(database.produit,{foreignKey:'Reduction'}); //reduction 1/N produit - cas contraire produit 1/1 reduction (donc l'Id reduction va dans la table produit  (le N vers le plus petit ))
database.commande.hasMany(database.paiement,{foreignKey:'Commande'}); //commande 1/N paiement - cas contraire paiement 1/1 commande (donc l'Id commande va dans la table paiement  (le N vers le plus petit ))
database.typepaiement.hasMany(database.paiement,{foreignKey:'TypePaiement'}); //typepaiement 1/N paiement - cas contraire paiement 1/1 typepaiement (donc l'Id typepaiement va dans la table paiement  (le N vers le plus petit ))
database.transporteur.hasMany(database.livraison,{foreignKey:'Transporteur'}); //transporteur 1/N livraison - cas contraire livraison 1/1 transporteur (donc l'Id transporteur va dans la table livraison  (le N vers le plus petit ))


// 1/1 

database.comptedepot.hasOne(database.client,{foreignKey:'CompteDepot'}); // comptedepot 1/1 client - cas contraire client 1/1 comptedepot (Echange d'Id) (Donc l'id comptedepot va dans la tables client ou inversement selon notre choix)
database.enchere.hasOne(database.produit,{foreignKey:'Enchere'}); // enchere 1/1 produit - cas contraire produit 1/1 enchere (Echange d'Id) (Donc l'id enchere va dans la tables produit ou inversement selon notre choix)
database.facture.hasOne(database.paiement,{foreignKey:'Facture'}); // facture 1/1 paiement - cas contraire paiement 1/1 facture (Echange d'Id) (Donc l'id facture va dans la tables paiement ou inversement selon notre choix)


/*  Table intermediaire  1/N ET 0/N - 1/N ET O/N */

database.commande.belongsToMany(database.livraison,{through:'livrer',foreignKey:'CommandeId'});
database.livraison.belongsToMany(database.commande,{through:'livrer',foreignKey:'LivraisonId'});

database.produit.belongsToMany(database.fournisseur,{through:'fournir',foreignKey:'ProduitId'});
database.fournisseur.belongsToMany(database.produit,{through:'fournir',foreignKey:'FournisseurId'});

database.produit.belongsToMany(database.categorie,{through:'composer',foreignKey:'ProduitId'});
database.categorie.belongsToMany(database.produit,{through:'composer',foreignKey:'CategorieId'});

database.taille.belongsToMany(database.produit,{through:'comporter',foreignKey:'TailleId'});
database.produit.belongsToMany(database.taille,{through:'comporter',foreignKey:'ProduitId'});

database.produit.belongsToMany(database.commande,{through:'contenir',foreignKey:'ProduitId'})
database.commande.belongsToMany(database.produit,{through:'contenir',foreignKey:'CommandeId'})

/* ------------------------------------------------------------------------------------------------------------------------------------------ */


// Fait reference a l'instance de la base de données
database.ConnexionDb = ConnexionDb;

// Le module Sequelize
database.Sequelize = Sequelize;

 /*
 * Synchronisez tous les modèles définis avec la base de données.
 * Similaire pour la synchronisation: vous pouvez définir ceci pour toujours forcer la synchronisation pour les modèles
 */
 //ConnexionDb.sync({ force: true });

// Module est une variable qui représente le module actuel et exports est un objet qui sera exposé en tant que module.
// Ainsi, tout ce que vous affectez à module.exports ou à des exportations sera exposé en tant que module.

module.exports = database;