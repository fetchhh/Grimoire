// Require
const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
  const authorization = request.headers?.authorization;

  if (!authorization) {
    return response.status(400).json({ message: "Token manquant" });
  }
  // Token verification
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (error, result) => {
    if (error) {
      return response.status(401).json({ message: "Token invalide ou expiré" });
    }
    request.auth = result;
    // Next middleware
    next();
  });
};

// Exports
module.exports = auth;
