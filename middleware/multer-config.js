/******************** CONFIGURATION DE MULTER ********************/

/* Importation multer */
const multer = require('multer');

/* Creation d'un dictionnaire MIME_TYPES */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* Création de l'objet de la configuration de MULTER */
const storage = multer.diskStorage({
    /* Pour définir le dossier d'images comme destination */
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        /* Pour définir le nom des fichiers en utilisant le nom original, où les espaces sont remplacés par _ */
        const name = file.originalname.split(' ').join('_');
        /* Génération de l'extension en choisissant dans le dictionnaire MIME_TYPE le mimetype qui correspond au mimetype du fichier. */
        const extension = MIME_TYPES[file.mimetype];
        /* Création du nom du fichier à la date pour le rendre unique */
        callback(null, name + Date.now() + '.' + extension);
    }
});

/* Exporting the multer middleware */
module.exports = multer({storage}).single('image');
