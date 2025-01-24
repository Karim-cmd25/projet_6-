const express = require("express");
const router = express.Router();
const books = require("../models/books");
const auth = require("auth");
const booksCtrl = require("../controllers/books");

// POST : Créer un livre
router.post("/", auth, booksCtrl.createBooks);

// PUT : Modifier un livre
router.put("/:id", auth, booksCtrl.modifyBooks);

// DELETE : Supprimer un livre
router.delete("/:id", auth, booksCtrl.deleteBooks);

// GET : Obtenir un livre par ID
router.get("/:id", auth, booksCtrl.getOneBooks);

// GET : Obtenir tous les livres
router.get("/", auth, booksCtrl.getAllBooks);

module.exports = router;
