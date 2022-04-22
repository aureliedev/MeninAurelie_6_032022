/******************** CONFIGURATION DE USER MODEL ********************/

/* Importation de mongoose & mongoose-unique-validator */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* Creation de user schema */
/* Utilisation de mongoose-unique-validator pour éviter d'avoir plus d'un utilisateur avec une adresse électronique spécifique. */
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

/* Application du validateur au schéma de l'utilisateur */
userSchema.plugin(uniqueValidator);

/* Exportation user schema */
module.exports = mongoose.model('User', userSchema);