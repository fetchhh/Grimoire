// Require
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// Env
require("dotenv").config();

const app = express();
// Port
const port = process.env.port || 4000;

// Mongoose
mongoose
  .connect(process.env.MONGOOSE_SERVER)
  .then(() => {
    console.log("[Mongoose] connected succesfully");
  })
  .catch(() => {
    console.log("[Mongoose] failed to connect");
  });

// Routes
const booksRoute = require("./routes/book");
const authRoute = require("./routes/auth");

// Headers
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// Body parser
app.use(express.json());

// Routers
app.use("/api/books", booksRoute);
app.use("/api/auth", authRoute);

// Static path
app.use("/images", express.static(path.join(__dirname, "images")));

// Listen
app.listen(port, () => {
  console.log(`[App] listening on :${port}`);
});
