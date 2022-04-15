/******************** CONFIGURATION SAUCE CONTROLLER ********************/

/* Importation Sauce model */
const Sauce = require('../models/Sauce');

/* Importation de Node File System package */
const fs = require('fs');

/* Création d'une REGEX pour vérifier la validité des entrées req afin d'éviter les injections. */
const regexInputs = /^[a-zA-Z0-9 _.,!()&éêèàçùîï]+$/

/* Création de la fonction pour POST une nouvelle sauce */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    /* Vérification de la validité des entrées de la demande pour éviter l'injection. */
    if(
      !regexInputs.test(sauceObject.name)|| 
      !regexInputs.test(sauceObject.manufacturer)||
      !regexInputs.test(sauceObject.description)||
      !regexInputs.test(sauceObject.mainPepper)||
      !regexInputs.test(sauceObject.hear)){
        return res.status(401).json({message : "Certains champs sont renseignés avec des caractères invalides"})
    }
    /* Si les entrées sont valides, création d'une nouvelle sauce en utilisant le sauce model */
    const sauce = new Sauce({
      ...sauceObject,
      likes:0,
      dislikes:0,
      userDisliked: [],
      userLiked: [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    /* Sauvegarde de la sauce dans la database */
    sauce.save()
      .then(() => res.status(201).json({message: "Sauce ajoutée"}))
      .catch(error => res.status(400).json({error}));
  };

/* Création de la fonction GET de toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}))
  };

/* Création de la fonction pour obtenir une sauce spécifique */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  };

/* Création de la fonction modify (PUT) une sauce spécifique */
exports.modifySauce = (req, res, next) => {
    /* Utilisation de opérateur conditionnel (?) pour traiter les deux possibilités */
    const sauceObject = req.file ?
    {
      /* Si la requête PUT est accompagnée d'un nouveau fichier image, on analyse du corps de la requête et on définit un nouveau imageUrl. */
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      /* Si la requête PUT n'est pas accompagnée d'un nouveau fichier image, définir sauceObject comme ...req.body */
    } : { ...req.body};
    /* Vérification de la validité des entrées de req pour éviter l'injection. */
    if(
      !regexInputs.test(sauceObject.name)|| 
      !regexInputs.test(sauceObject.manufacturer)||
      !regexInputs.test(sauceObject.description)||
      !regexInputs.test(sauceObject.mainPepper)||
      !regexInputs.test(sauceObject.hear)){
        return res.status(401).json({message : "Certains champs sont renseignés avec des caractères invalides"})
    }
    /* Si les entrées sont valides, MAJde la sauce */
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: "Sauce modifiée"}))
    .catch(error => res.status(400).json({error}));
  };

/* Création de la fonction pour SUPPRIMER une sauce spécifique */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      if (!sauce){
        return res.status(404).json({error: 'Sauce non trouvée !'});
      }
      if (sauce.userId !== req.auth.userId){
        return res.status(403).json({error: 'Requête non autorisée !'})
      }
      /* Récupération du nom de fichier dans l'imageUrl */
      const filename = sauce.imageUrl.split('/images')[1];
      /* Suppression du fichier image */
      fs.unlink(`images/${filename}`, () => {
        /* Suppression de la sauce */
        Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: "Sauce supprimée"}))
        .catch(error => res.status(400).json({error}))
      })
    })
    .catch(error => res.status(500).json({error : "Sauce non trouvée !"}));
};

/* Création de la fonction pour gérer les likes et les dislikes */
exports.rateSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {
    /* L'utilisateur n'a pas déjà liker la sauce et le choix du like est 1 (like) */
    if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
      /* MAJ de la sauce en incrémentant les likes (+1) et en poussant le userId dans le tableau usersLiked. */
      Sauce.updateOne({_id: req.params.id}, {$inc: {likes: +1}, $push: {usersLiked: req.body.userId}})
      .then(() => res.status(200).json({message: "sauce likée"}))
      .catch(error => res.status(400).json({error}));
    /* L'utilisateur a précédemment liker la sauce mais annule son choix (neutre) */
    } else if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
      /* MAJ de la sauce en décrémentant les likes (-1) et extraction de userId du tableau usersLiked. */
      Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
      .then(() => res.status(200).json({message: "choix neutre"}))
      .catch(error => res.status(400).json({error}));
    /* L'utilisateur n'a pas déjà dislike la sauce et le choix du like est -1 (dislike). */
    } else if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
      /* MAJ de la sauce en incrémentant les dislikes (+1) et en plaçant l'identifiant de l'utilisateur dans le tableau usersDisliked. */
      Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}})
      .then(() => res.status(200).json({message: "sauce dislikée"}))
      .catch(error => res.status(400).json({error}));
    /* L'utilisateur n'aimait pas la sauce auparavant mais annule son choix (neutre) */
    } else if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
      /* MAJ des sauces en décrémentant les dislikes (-1) et extraction userId du tableau usersDisliked */
      Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
      .then(() => res.status(200).json({message: "choix neutre"}))
      .catch(error => res.status(400).json({error}))
    } else {
      return res.status(401).json({message: "l'opération n'a pas pu être effectuée"})
    }
  })
  .catch(error => res.status(404).json({error}));
};