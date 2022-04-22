# FORMATION DEVELOPPEUR WEB - OPEN CLASSROOMS - PROJET 6 #
# Construction d'une API sécurisée pour une application d'avis gastronomiques #
### CONTEXTE ###

**Piiquante** se dédie à la **création de sauces épicées** dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une **application web** dans laquelle les utilisateurs peuvent **ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres**.

L'application frontend a été développée en amont, elle est disponible sur [ce repository](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6).

Notre mission est de développer une **API REST sécurisée** pour cette application.
<hr>

### INSTALLATION ###

Créer un dossier vide. Ce dernier contiendra le code complet, regroupé dans deux dossiers : un dossier frontend et un backend.

#### 1. Installation de l'application Frontend ####

Ouvrir un terminal. 
Depuis le dossier précédement créé, clonez le repository de l'application frontend avec la commande :
<pre><code>git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git frontend</code></pre>
Suivez les instructions d'installation de l'application frontend détaillées dans le document README.md.

#### 2. Installation de l'API ####

Ouvrez un nouveau terminal.
Depuis le dossier précédement créé, clonez le repository de l'API avec la commande.

Depuis le dossier backend, installez les dépendances avec la commande :
<pre><code>npm install</code></pre>

#### 3. Création d'une base de données noSQL MongoDB ####

Rendez-vous sur le site de [MongoDb](https://account.mongodb.com/) pour créer un compte.

Une fois la base de données créé, vous devriez avoir :
- Un identifiant de connexion à la base de données
- Un mot de passe de connexion à la base de données

#### 4. Configuration des variables d'environnement ####
A la racine du dossier backend, créez un fichier .env dans lequel seront renseignés vos identifiants de connexion à MongoDB et les différentes chaînes de cryptage :

<pre><code>dbUserName = identifiant de connexion à la base de données
dbPassword = mot de passe de connexion à la base de données
DB_NAME = nom de la base de données
JWT_TOKEN_SECRET = chaîne de caractères aléatoire
EMAIL_ENCRYPTION_KEY = chaîne de caractères aléatoire</code></pre>

A la racine du dossier backend, créer un fichier .gitignore dans lequel vous placez les node modules, le fichier .env et le dossier /images 

Enfin, démarrez le serveur avec la commande :
<pre><code>nodemon server</code></pre>

Si tout se passe bien, les messages suivants apparaissent dans le terminal :

**Listening on port 3000**

**Connexion à MongoDB réussie !**
<hr>