const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compress = (request, response, next) => {
  if (request.file) {
    const filePath = request.file.path;
    const ouputPath = path.join(
      "images",
      `compressed-${request.file.filename}`,
    );

    // Compress file
    sharp(filePath)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(ouputPath, (err, info) => {
        if (err) {
          return next(err);
        }

        request.file.path = ouputPath;
        // Attempt to delete previous file
        fs.unlink(filePath);
      });
  }
  next();
};

// Exports
module.exports = compress;
