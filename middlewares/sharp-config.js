const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compress = (request, response, next) => {
  if (request.file) {
    const filePath = request.file.path;
    const ouputPath = path.join(
      "images",
      `compressed-${path.parse(request.file.originalname).name}.webp`,
    );

    // Compress and convert file
    sharp(filePath)
      .resize({ width: 600 })
      .webp({ quality: 80 })
      .toFile(ouputPath, (err, info) => {
        if (err) {
          return response.status(500).json({ error });
        }
        request.file.filename = `compressed-${path.parse(request.file.originalname).name}.webp`;
        // Delete previous file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
        next();
      });
  } else {
    next();
  }
};

// Exports
module.exports = compress;
