const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Utilise 'required' au lieu de 'require'
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Modifié ici aussi
  year: { type: Number, required: true },
  genre: { type: String, required: true }, // Modifié ici aussi
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true }, // Modifié ici aussi
});

module.exports = mongoose.model("books", booksSchema);
