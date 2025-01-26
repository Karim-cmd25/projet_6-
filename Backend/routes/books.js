const express = require("express");
const router = express.Router();
const books = require("../models/books");
const auth = require("../middleware/auth");
const booksCtrl = require("../controllers/books");
const multer = require("../middleware/multer-config");

// POST : Créer un livre
router.post("/", auth, multer, booksCtrl.createBooks);

// PUT : Modifier un livre
router.put("/:id", auth, multer, booksCtrl.modifyBooks);

// DELETE : Supprimer un livre
router.delete("/:id", auth, booksCtrl.deleteBooks);

// GET : Obtenir un livre par ID
router.get("/:id", auth, booksCtrl.getOneBooks);

// GET : Obtenir tous les livres
router.get("/", auth, booksCtrl.getAllBooks);

module.exports = router;
