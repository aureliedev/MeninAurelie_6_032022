/******************** CONFIGURATION DE L'APPLICATION EXPRESS********************/

/* Importation express */
const express = require('express');

/* Importation mongoose */
const mongoose = require('mongoose');

/* Importation user router */
const userRoutes = require('./routes/user');

/* Importation sauce router */
const sauceRoutes = require('./routes/sauce');

/* Importation Node path package */
const path = require('path')

/* Utilisation de dotenv pour cacher les informations de connexion à la DB */
require('dotenv').config();
const username = process.env.dbUserName;
const password = process.env.dbPassword;
const db = process.env.DB_NAME;

/* Connexion de EXPRESS à la base de données MongoDB */
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.waoub.mongodb.net/${db}?retryWrites=true&w=majority`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Créer l'application EXPRESS en utilisant la méthode express */
const app = express();

/* Création d'un middleware utilisant la méthode .json d'express pour avoir accès au corps de la requête */
app.use(express.json());

/* Spécification HEARDERS de contrôle d'accès spécifiques pour tous les objets de réponse afin d'autoriser les demandes d'origine croisée (et d'éviter les erreurs CORS). */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


/* Sauvegarde user routes */
app.use('/api/auth', userRoutes);

/* Sauvegarde sauce routes */
app.use('/api/sauces', sauceRoutes);

/* Création d'un middleware pour gérer les demandes d'ajout d'images dans le dossier images */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Exporter d' EXPRESS pour l'utiliser sur d'autres fichiers */
module.exports = app;

app.use((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});
