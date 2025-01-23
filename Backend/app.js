const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// Importer correctement le modèle Books
const Books = require("../Backend/models/books");
const booksRoutes = require("../Backend/routes/books");

mongoose
  .connect(
    "mongodb+srv://karim-mongdb:Maison30.@cluster0.spu8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// POST : Ajouter un livre
app.post("/api/books/", (req, res, next) => {
  delete req.body._id; // Supprimer _id de la requête (si présent)
  const newBook = new Books({
    ...req.body,
  });
  newBook
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

// PUT : Modifier un livre
app.put("/api/books/:id", (req, res, next) => {
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

// DELETE : Supprimer un livre
app.delete("/api/books/:id", (req, res, next) => {
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
});

// GET : Obtenir un livre par ID
app.get("/api/books/:id", (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
});

// GET : Obtenir tous les livres
app.get("/api/books", (req, res, next) => {
  Books.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});

app.use("/api/books", booksRoutes); // Appel du router pour les autres routes de livres

module.exports = app;
