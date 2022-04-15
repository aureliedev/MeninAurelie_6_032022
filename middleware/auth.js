/******************** CONFIGURATION AUTHENTICATION MIDDLEWARE ********************/

/* Importation jsonwebtoken */
const jwt = require('jsonwebtoken');

/* Utilisation de dotenv pour cacher JWT_SECRET_TOKEN */
require('dotenv').config();
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

/* Exportation du middleware d'authentification */
module.exports = (req, res, next) => {
    try {
    /* Récupération du token d'autorisation à partir des HEARDERS de la demande. */
    const token = req.headers.authorization.split(' ')[1];

    /* Décodage du token avec la fonction verify() */
    const decodedToken = jwt.verify(token, JWT_SECRET_TOKEN);

    /* Défini userId comme l'userId trouvé dans le decodedToken */
    const userId = decodedToken.userId;
    
    /* Ajout de l'objet d'authentification qui contient l'userId à la requête */
    req.auth = {userId}

    /* Si l'ID utilisateur de la demande est différent de l'ID utilisateur renvoyé par l'opération précédente, une erreur sera signalée. */
    if (req.body.userId && req.body.userId !== userId) {
        throw 'User UD non valable';
    } else {
    /* Si l'identifiant de l'utilisateur dans la requête est identique à l'identifiant de l'utilisateur renvoyé par l'opération précédente, l'appel de la fonction next() pour exécuter le middleware suivant. */
        next();
    }
    /* Traitement des erreurs */
    } catch (error) {
    res.status(403).json({error})
    }
};