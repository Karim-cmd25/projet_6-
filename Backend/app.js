// Importation des modules nécessaires
const express = require("express"); // Framework Express pour gérer les routes et middleware
const mongoose = require("mongoose"); // ODM pour MongoDB (Mongoose)

const mongoUri = process.env.MONGO_URI; // Connexion MongoDB depuis la variable d'environnement

// Importation des routes pour gérer les livres et l'authentification des utilisateurs
const bookRoutes = require("./routes/book"); // Routes pour les livres
const path = require("path"); // Module pour gérer les chemins de fichiers

const userRoutes = require("./routes/user"); // Routes pour l'authentification des utilisateurs

// Connexion à MongoDB via l'URI, ici avec les identifiants dans la chaîne de connexion (à ne pas exposer en production)
mongoose
  .connect(
    "mongodb+srv://karim-mongdb:Maison30.@cluster0.spu8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", // URI de connexion à MongoDB
    { useNewUrlParser: true, useUnifiedTopology: true } // Options pour éviter les avertissements de dépréciation
  )
  .then(() => console.log("Connexion à MongoDB réussie !")) // Si la connexion réussit, on affiche un message
  .catch(() => console.log("Connexion à MongoDB échouée !")); // Si la connexion échoue, on affiche un message d'erreur

// Création de l'application Express
const app = express();

// Middleware qui gère les erreurs liées aux CORS (Cross-Origin Resource Sharing)
// Permet d'autoriser les requêtes de n'importe quel domaine
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet l'accès depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Autorise certains en-têtes dans les requêtes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Autorise les méthodes HTTP spécifiées
  next(); // Passe à l'étape suivante du middleware
});

// Définition des routes pour les livres et l'authentification des utilisateurs
app.use("/api/books", bookRoutes); // Route pour les opérations sur les livres (CRUD)
app.use("/api/auth", userRoutes); // Route pour l'authentification des utilisateurs (connexion, inscription)
// Middleware pour traiter les requêtes JSON dans le corps des requêtes POST
app.use(express.json()); // Permet de lire et d'analyser le corps JSON d'une requête

// Middleware pour gérer les fichiers statiques (images ici)
app.use("/images", express.static(path.join(__dirname, "images"))); // On expose le dossier "images" comme répertoire statique

// On exporte l'application pour pouvoir l'utiliser dans d'autres fichiers (comme le serveur)
module.exports = app;
