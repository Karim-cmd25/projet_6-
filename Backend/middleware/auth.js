// Importation de la bibliothèque jsonwebtoken qui permet de creer et vérifier les JSON Web Tokens
const jwt = require("jsonwebtoken");
require("dotenv").config(); /** Load environnement variables from .env file to process.env */

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Récupération du token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.secrettoken);

    // Récupération de l'ID de l'utilisateur
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
