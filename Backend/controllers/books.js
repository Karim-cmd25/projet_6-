const Books = require("../models/books");
const path = require("path");
const fs = require("fs");

// POST : Créer un livre
exports.createBooks = (req, res, next) => {
  // Vérifie d'abord si le fichier a bien été téléchargé
  if (!req.file) {
    return res.status(400).json({ message: "Fichier manquant" });
  }

  try {
    // Parse les données 'book' envoyées dans le corps de la requête
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    // Crée le livre avec les données envoyées et l'URL de l'image
    const book = new Books({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    // Sauvegarde le livre dans la base de données
    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Livre enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res
      .status(400)
      .json({
        error:
          "Erreur lors de la création du livre, problème dans les données envoyées.",
      });
  }
};

// PUT : Modifier un livre
exports.modifyBooks = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Books.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "Not authorized" });
      } else {
        if (req.file) {
          // Supprime l'ancienne image si une nouvelle image est envoyée
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {});
        }

        // Mise à jour du livre
        Books.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE : Supprimer un livre
exports.deleteBooks = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          book
            .deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// GET : Récupérer un livre par ID
exports.getOneBooks = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// GET : Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Books.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// POST : Ajouter une note à un livre
exports.createRating = async (req, res) => {
  try {
    const { rating } = req.body;

    // Vérifie si la note est valide (entre 0 et 5)
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5" });
    }

    // Recherche le livre par son ID
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifie si l'utilisateur a déjà noté ce livre
    const userIdArray = book.ratings.map((rating) => rating.userId);
    if (userIdArray.includes(req.auth.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Ajoute la nouvelle notation au livre
    book.ratings.push({ ...req.body, grade: rating });

    // Calcul de la moyenne des notes manuellement
    const totalGrades = book.ratings.reduce(
      (sum, rating) => sum + rating.grade,
      0
    );
    book.averageRating = (totalGrades / book.ratings.length).toFixed(1);

    // Sauvegarde le livre avec la nouvelle note
    await book.save();
    return res.status(201).json(book);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la création de la notation" });
  }
};

// GET : Récupérer les 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
  Books.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};
