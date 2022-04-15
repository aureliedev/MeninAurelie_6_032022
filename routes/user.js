/******************** CONFIGURATION DE USER ROUTER ********************/

/* Importation express */
const express = require('express');

/* Création d'un routeur avec la fonction Router() */
const router = express.Router();

/* Importation user controller */
const userControl = require('../controllers/user');

/* Création des routes signup and login */
router.post('/signup', userControl.signup);
router.post('/login', userControl.login)

/* Exportation du router */
module.exports = router;