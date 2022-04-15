/******************** CONFIGURATION DU NODE SERVER ********************/

/* Importation node HTTP package */
const http = require('http');

/* Importation de l'application EXPRESS */
const app = require('./app');

/* Création d'une fonction normalizePort qui renvoie un port valide, qu'il soit fourni sous la forme d'un nombre ou d'une chaîne. */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);


/* Création d'une fonction errorHandler pour vérifier et traiter les erreurs de manière appropriée. */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* Création d'un serveur avec createServer avec http package et on passe de l'application express en paramètre. */
const server = http.createServer(app);

/* Enregistrement de la fonction errorHandler dans le serveur */
server.on('error', errorHandler);

/* Création d'un event listener pour enregistrer dans la console le port sur lequel le serveur est exécuté. */
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

/* Écoute du port tel que défini */
server.listen(port);
