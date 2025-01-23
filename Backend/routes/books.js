const express = require("express");
const router = express.Router();
const Books = require("../models/books");
const booksCtrl = require("../controllers/books");

// POST : Créer un livre
router.post("/", booksCtrl.createBooks);

// PUT : Modifier un livre
router.put("/:id", booksCtrl.modifyBooks);

// DELETE : Supprimer un livre
router.delete("/:id", booksCtrl.deleteBooks);

// GET : Obtenir un livre par ID
router.get("/:id", booksCtrl.getOneBooks);

// GET : Obtenir tous les livres
router.get("/", booksCtrl.getAllBooks);

module.exports = router;
