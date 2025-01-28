// Importation des modules nécessaires
const http = require("http"); // Module pour créer un serveur HTTP natif
const app = require("./app"); // L'application Express que nous avons définie dans app.js

// Fonction qui détermine le port, en vérifiant si c'est un nombre valide
const calculerPort = (val) => {
  const port = parseInt(val, 10); // Convertit la valeur en un nombre entier

  if (isNaN(port)) {
    // Si ce n'est pas un nombre valide
    return val; // On retourne la valeur telle quelle (ex. : un string)
  }
  if (port >= 0) {
    // Si c'est un nombre et qu'il est positif ou égal à zéro
    return port; // On retourne ce nombre comme le port
  }
  return false; // Si ce n'est pas un nombre valide, retourne false
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// On définit le port, soit depuis les variables d'environnement (si spécifié), sinon par défaut à 5000
const port = calculerPort(process.env.PORT || "5000");
app.set("port", port); // On assigne le port à l'application Express

// Fonction pour gérer les erreurs liées à l'écoute du serveur
const gererErreurServeur = (erreur) => {
  if (erreur.syscall !== "listen") {
    // Si l'erreur n'est pas liée à l'écoute
    throw erreur; // On relance l'erreur
  }

  const address = server.address(); // On récupère l'adresse du serveur
  const pointDeConnexion =
    typeof address === "string" ? "pipe " + address : "port : " + port; // Si c'est une adresse ou un port

  switch (
    erreur.code // On gère différents types d'erreurs
  ) {
    case "EACCES": // Si l'erreur est un problème de permission
      console.error(
        `${pointDeConnexion} nécessite des privilèges d'administrateur.`
      ); // Affiche le message d'erreur
      process.exit(1); // On arrête le processus avec un code d'erreur
      break;
    case "EADDRINUSE": // Si l'adresse ou le port est déjà utilisé
      console.error(
        `${pointDeConnexion} est déjà utilisé par une autre application. Choisissez un autre port.`
      ); // Affiche un message indiquant que le port est déjà utilisé
      process.exit(1); // On arrête le processus avec un code d'erreur
      break;
    default:
      throw erreur; // Si c'est une autre erreur, on la relance
  }
};

// On écoute l'événement d'erreur et on appelle la fonction gererErreurServeur
server.on("error", gererErreurServeur);

// Quand le serveur commence à écouter, on affiche l'adresse ou le port
server.on("listening", () => {
  const address = server.address(); // On récupère l'adresse du serveur
  const pointDeConnexion =
    typeof address === "string" ? "pipe " + address : "port " + port; // On prépare le message à afficher
  console.log(`🟢 Serveur démarré avec succès sur ${pointDeConnexion} 🚀`); // Affiche que le serveur écoute sur l'adresse/port
});

// Le serveur commence à écouter sur le port spécifié
server.listen(port);
