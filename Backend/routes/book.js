const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

// Logique des routes books
router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, multer.resizeImage, bookCtrl.createBook);
router.put("/:id", auth, multer, multer.resizeImage, bookCtrl.modifyBook);

router.post("/:id/rating", auth, bookCtrl.rateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
