// Require
const express = require("express");
const multer = require("../middlewares/multer-config");
const auth = require("../middlewares/auth-config");

const bookController = require("../controllers/book");
const router = express.Router();

// Get all books
router.get("/", bookController.getBooks);
// Get the most liked books
router.get("/bestrating", bookController.getBestBooks);
// Get a book
router.get("/:id", bookController.getBook);
// Post a book
router.post("/", multer, auth, bookController.postBook);
// Post a rating
router.post("/:id/rating", auth, bookController.addRating);
// Update a book
router.put("/:id", auth, multer, bookController.updateBook);
// Delete a book
router.delete("/:id", auth, bookController.deleteBook);

// Exports
module.exports = router;
