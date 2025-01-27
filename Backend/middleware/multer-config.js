// Middleware qui gère le téléchargement de fichiers dans une app express
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  // enregistre les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Nom des images => nom d'origine, remplacement des espaces et des points par des underscores, ajout d'un timestamp
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// single image indique que le middleware traitera un seul fichier
module.exports = multer({ storage: storage }).single("image");

// Redimensionnement de l'image
module.exports.resizeImage = (req, res, next) => {
  // Vérifie si un fichier a été téléchargé
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const tempFilePath = path.join("images", `temp_${fileName}`); // Chemin temporaire pour l'image redimensionnée

  sharp(filePath)
    .resize({
      width: 206,
      height: 260,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy, // Ajuste pour garder la partie la plus intéressante de l'image
    })
    .toFile(tempFilePath) // Sauvegarde dans un fichier temporaire
    .then(() => {
      // Après redimensionnement, supprime l'image originale
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'image originale:",
            err
          );
          return next(err);
        }
        // Renomme le fichier temporaire pour qu'il ait le nom de l'image originale
        fs.rename(tempFilePath, filePath, (err) => {
          if (err) {
            console.error(
              "Erreur lors du renommage de l'image redimensionnée:",
              err
            );
            return next(err);
          }
          next();
        });
      });
    })
    .catch((err) => {
      console.error("Erreur lors du redimensionnement de l'image:", err);
      return next(err);
    });
};
