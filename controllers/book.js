// Require
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

// Get all the books available
exports.getBooks = (request, response, next) => {
  Book.find()
    .then((entries) => response.status(200).json(entries))
    .catch((error) => response.status(500).json({ error }));
};

// Get the 3 most liked books
exports.getBestBooks = (request, response, next) => {
  Book.find()
    .sort({ "ratings.grade": -1 })
    .limit(3)
    .then((entries) => {
      response.status(200).json(entries);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
};

// Get a book by a given ID
exports.getBook = (request, response, next) => {
  Book.findOne({ _id: request.params.id })
    .then((entry) => {
      response.status(200).json(entry);
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
};

// Post a new book
exports.postBook = (request, response, next) => {
  // Check if there is an image
  if (!request.file) {
    return response.status(400).json({ message: "Image requise" });
  }

  // New book
  const newEntry = new Book({
    ...JSON.parse(request.body.book),
    userId: request.auth.userId,
    imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
  });

  // Save the new book
  newEntry
    .save()
    .then(() => {
      response.status(201).json({ message: "Crée" });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({ error });
    });
};

// Modify a book
exports.updateBook = (request, response, next) => {
  // Updated book
  const updatedEntry = request.file
    ? {
        ...JSON.parse(request.body.book),
        imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
      }
    : { ...request.body };

  // Find the book to update
  Book.findOne({ _id: request.params.id })

    .then((entry) => {
      // Verify that server & client userIDs' are matching
      if (entry.userId !== request.auth.userId) {
        return response.status(403).json({ message: "Non-autorisé" });
      }

      if (request.file) {
        // Delete old image if modified
        const deletePath = path.join("images", path.basename(entry.imageUrl));
        fs.unlink(deletePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      // Save the updated book
      Book.updateOne(
        { _id: request.params.id },
        { ...updatedEntry, _id: request.params.id },
      )
        .then(() => {
          response.status(200).json({ message: "Modifié" });
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    })

    .catch((error) => {
      response.status(404).json({ error });
    });
};

// Add a new rating
exports.addRating = (request, response, next) => {
  // New rating
  const userRating = {
    userId: request.auth.userId,
    grade: request.body.rating,
  };

  // Verifiy that the grade is between 0 & 5
  if (userRating.grade > 5 || userRating.grade < 0) {
    return response.status(400).json({ message: "Note invalide" });
  }

  // Find the book to rate
  Book.findOne({ _id: request.params.id })

    .then((entry) => {
      // Check if user has already rated this book
      if (
        !entry.ratings.every(({ userId }) => userId !== request.auth.userId)
      ) {
        return response.status(409).json({ message: "Note déja ajouté" });
      }

      // Push the new rating and calculate the new average
      entry.ratings.push(userRating);
      const newAverage =
        entry.ratings.reduce((sum, { grade }) => sum + grade, 0) /
        entry.ratings.length;
      entry.averageRating = newAverage;

      // Save the updated ratings
      entry
        .save()
        .then((updatedRatings) => {
          response.status(200).json(updatedRatings);
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
};

// Delete a book
exports.deleteBook = (request, response, next) => {
  // Find the book to delete
  Book.findOne({ _id: request.params.id })
    .then((entry) => {
      // Verify that server & client userIDs' are matching
      if (entry.userId !== request.auth.userId) {
        return response.status(403).json({ message: "Non-autorisé" });
      }
      // Delete image
      const deletePath = path.join("images", path.basename(entry.imageUrl));
      fs.unlink(deletePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
      // Delete the book
      Book.deleteOne({ _id: request.params.id })
        .then(() => {
          response.status(200).json({ message: "Supprimé" });
        })
        .catch((error) => {
          response.status(500).json({ error });
        });
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
};
