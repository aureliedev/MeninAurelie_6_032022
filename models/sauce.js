/******************** CONFIGURATION SAUCE MODEL ********************/

/* Importation EXPRESS */
const mongoose = require('mongoose');

/* Creation sauce schema */
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, defaut: 0},
    dislikes: {type: Number, defaut: 0},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]} 
})

/* Exportation sauce schema comme modèle */
module.exports = mongoose.model('Sauce', sauceSchema);