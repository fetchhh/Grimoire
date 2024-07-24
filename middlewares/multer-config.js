// Require
const multer = require("multer");

// Storage
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "images");
  },
  filename: (request, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
  filefilter: (request, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      callback(null, true);
    } else {
      return callback(new Error("Format de fichier non-supporté"));
    }
  },
});

// Exports
module.exports = multer({ storage: storage }).single("image");
