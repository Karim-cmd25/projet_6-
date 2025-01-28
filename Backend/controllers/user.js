// Importation du modèle User pour interagir avec la base de données
const User = require("../models/User");
// Importation de bcrypt pour le hachage des mots de passe
const bcrypt = require("bcrypt");
// Importation de jsonwebtoken pour générer un token JWT
const jwt = require("jsonwebtoken");

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Utilisation de bcrypt pour hacher le mot de passe fourni dans la requête
  bcrypt
    .hash(req.body.password, 12) // Le deuxième argument (10) définit le nombre de rounds pour le hachage
    .then((hash) => {
      // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email, // L'email fourni dans la requête
        password: hash, // Le mot de passe haché
      });
      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Si la sauvegarde réussie, on envoie une réponse de succès
        .catch((error) => res.status(400).json({ error })); // Si une erreur se produit, on envoie une réponse d'erreur (par exemple si l'email est déjà utilisé)
    })
    .catch((error) => res.status(500).json({ error })); // Si le hachage échoue, une erreur interne du serveur est envoyée
};

// Fonction pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données avec l'email fourni dans la requête
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // Si l'utilisateur n'existe pas, on renvoie une erreur 401
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Si l'utilisateur existe, on compare le mot de passe fourni avec celui stocké dans la base (haché)
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // Si le mot de passe est incorrect, on renvoie une erreur 401
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Si le mot de passe est valide, on génère un token JWT pour l'utilisateur
          res.status(200).json({
            userId: user._id, // On renvoie l'ID de l'utilisateur pour qu'il puisse être utilisé sur le frontend
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              // Génération du token JWT avec une clé secrète
              expiresIn: "24h", // Le token expire après 24 heures
            }),
          });
        })
        .catch((error) => res.status(500).json({ error })); // Si la comparaison échoue, on renvoie une erreur interne
    })
    .catch((error) => res.status(500).json({ error })); // Si la recherche de l'utilisateur échoue, on renvoie une erreur interne
};
