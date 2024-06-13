// Require
const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// Register
router.post("/signup", authController.signUp);
// Log in
router.post("/login", authController.signIn);

// Exports
module.exports = router;
