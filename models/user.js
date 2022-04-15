/******************** CONFIGURATION DE USER MODEL ********************/

/* Importation de mongoose and mongoose-unique-validator */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* Creation de user schema */
/* Utilisation du plugin mongoose-unique-validator pour éviter d'avoir plus d'un utilisateur avec une adresse électronique spécifique. */
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

/* Application du validateur au schéma de l'utilisateur */
userSchema.plugin(uniqueValidator);

/* Exportation user schema comme modèle */
module.exports = mongoose.model('User', userSchema);