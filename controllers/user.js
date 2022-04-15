/******************** CONFIGURATION USER CONTROLLER ********************/

/* Importation bcrypt */
const bcrypt = require('bcrypt');

/* Importation crypto-js */
const cryptoJs = require('crypto-js');

/* Importation jsonwebtoken */
const jwt = require('jsonwebtoken')

/* Utilisation de dotenv por masquer JWT_SECRET_TOKEN */
require('dotenv').config();
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

/* Importation User model */
const User = require('../models/User');

/* Importation de email-validator & password-validator */
const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');

/* Création d'un schéma de validation pour les mots de passe */
const schema = new passwordValidator();

schema
.is().min(8)
.is().max(16)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols()

/* Création du middleware SignUp pour créer de nouveaux utilisateurs */
exports.signup = (req, res, next) => {
    /* Vérification de la validité des e-mails */
    if(!mailValidator.validate(req.body.email)){
       return res.status(500).json({message : "Adresse email non valide"})
    /* Vérification de la validité des mots de passe */
    } else if (!schema.validate(req.body.password)){
        return res.status(500).json({message : "Mot de passe non valide - Utilisez des majuscules, minuscules, chiffres et symboles, aucun espace, pour 8(min) à 16(max) caractères."})
    } else {
    /* Si l'email et le mot de passe sont valides, on chiffre l'email et le mot de passe avant de créer un nouvel utilisateur */
    const cryptedEmail = cryptoJs.SHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString();
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: cryptedEmail,
            password: hash
        });
        /* Sauvegarde de l'utilisateur dans la base de données */
        user.save()
        .then(() => res.status(201).json({message : 'Utilisateur créé'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}))
    }
};

/* Création du middleware login pour connecter les utilisateurs existants */
exports.login = (req, res, next) => {
    /* Cryptage de l'email pour retrouver l'utilisateur dans la base de données */
    const cryptedEmail = cryptoJs.SHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY).toString();
    User.findOne({email: cryptedEmail})
    .then(user => {
        if(!user){
            return res.status(401).json({message: "Aucun utilisateur ne correspond !"})
        }
        /* Comparaison du mot de passe de la demande avec le mot de passe de l'utilisateur */
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({message : "Mot de passe incorrect !"})
            }
            /* Si l'utilisateur est trouvé, renvoyer userId et le token d'authentification. */
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    JWT_SECRET_TOKEN,
                    {expiresIn: '24h'}
                )
            })
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}));
};