require("dotenv").config(); /** Load environnement variables from .env file to process.env */
const User = require("../models/User"); // Modèle User
const bcrypt = require("bcrypt"); // pour le hachage des mots de passe
const jwt = require("jsonwebtoken"); // pour générer un token JWT

// Expression régulière pour valider l'email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  // Validation de l'email : vérifier qu'il contient au moins 3 caractères et un format valide
  if (!email || email.length < 3 || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Veuillez fournir un email valide." });
  }

  // Validation du mot de passe : vérifier qu'il contient au moins 5 caractères
  if (!password || password.length < 5) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 5 caractères." });
  }

  // Utilisation de bcrypt pour hacher le mot de passe fourni dans la requête
  bcrypt
    .hash(password, 10) // Le deuxième argument (10) définit le nombre de rounds pour le hachage
    .then((hash) => {
      // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
      const user = new User({
        email: email, // L'email fourni dans la requête
        password: hash, // Le mot de passe haché
      });

      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Si la sauvegarde réussie
        .catch((error) => res.status(400).json({ error })); // Si l'email existe déjà ou une autre erreur
    })
    .catch((error) => res.status(500).json({ error })); // Si le hachage échoue
};

// Fonction pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Validation de l'email : vérifier qu'il contient au moins 3 caractères et un format valide
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Veuillez fournir un email valide." });
  }

  // Validation du mot de passe : vérifier qu'il contient au moins 5 caractères
  if (!password || password.length < 5) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 5 caractères." });
  }

  // Recherche de l'utilisateur dans la base de données avec l'email fourni dans la requête
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // Si l'utilisateur n'existe pas
        return res
          .status(401)
          .json({ error: "Couple email / mot de passe incorrect !" });
      }

      // Comparaison du mot de passe fourni avec celui stocké dans la base (haché)
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // Si le mot de passe est incorrect
            return res
              .status(401)
              .json({ error: "Couple email / mot de passe incorrect !" });
          }

          // Si tout est valide, on génère un token JWT
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.secrettoken, {
              expiresIn: "24h", // Le token expire après 24 heures
            }),
          });
        })
        .catch((error) => res.status(500).json({ error })); // Si la comparaison échoue
    })
    .catch((error) => res.status(500).json({ error })); // Si la recherche échoue
};
