// Require
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");

// Create new user
exports.signUp = (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then((hash) => {
    const newUser = new Auth({
      email: request.body.email,
      password: hash,
    });
    newUser
      .save()
      .then(() => {
        response.status(201).json({ message: "Utilisateur crée" });
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
  });
};

// Sign in
exports.signIn = (request, response, next) => {
  Auth.findOne({ email: request.body.email }).then((entry) => {
    // Mail verification
    if (!entry) {
      return response.status(401).json({ message: "Combinaison incorrecte" });
    }

    // Hash verification
    bcrypt.compare(request.body.password, entry.password).then((match) => {
      if (!match) {
        return response.status(401).json({ message: "Combinaison incorrecte" });
      }

      // Token generation
      response.status(200).json({
        userId: entry._id,
        token: jwt.sign({ userId: entry._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        }),
      });
    });
  });
};
