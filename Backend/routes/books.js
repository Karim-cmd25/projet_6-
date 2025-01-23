const express = require("express");
const router = express.Router();
const Books = require("../models/books"); // Le modèle Mongoose est 'Books' (avec majuscule)
const booksCtrl = require("../controllers/books");

// POST : Créer un livre
router.post("/", booksCtrl.createBooks);

// PUT : Modifier un livre
router.put("/:id", books.Ctrl.modifyBooks);

// DELETE : Supprimer un livre
router.delete("/:id", books.Ctrl.deleteBooks);

// GET : Obtenir un livre par ID
router.get("/:id", books.Ctrl.getOneBooks);

// GET : Obtenir tous les livres
router.get("/", books.Ctrl.getAllBooks);

module.exports = router;
