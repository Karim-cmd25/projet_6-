const Books = require("../models/books");

exports.createBooks = (req, res, next) => {
  delete req.body._id;
  const newBook = new Books({
    // Remplace `books` par `newBook`
    ...req.body,
  });
  newBook
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBooks = (req, res, next) => {
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBooks = (req, res, next) => {
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBooks = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Books.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
