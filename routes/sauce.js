/******************** CONFIGURATION SAUCE ROUTER ********************/

/* Importation EXPRESS */
const express= require('express');

/* Importation de la fonction router d'EXPRESS */
const router = express.Router();

/* Importation du middleware d'authentification */
const auth = require('../middleware/auth');

/* Importation du controller sauce */
const sauceControl = require('../controllers/sauce');

/* Importation de multer configuration */
const multer = require('../middleware/multer-config')

/* Création de toutes les routes en utilisant l'authentification, le multer et en connectant les routes aux fonctions de demande situées dans le contrôleur de sauce. */
router.post('/', auth, multer, sauceControl.createSauce); 
router.get('/', auth, sauceControl.getAllSauces);
router.get('/:id', auth, sauceControl.getOneSauce); 
router.put('/:id', auth, multer, sauceControl.modifySauce); 
router.delete('/:id', auth, sauceControl.deleteSauce);
router.post('/:id/like', auth, sauceControl.rateSauce)

/* Exportation du router*/
module.exports = router;




