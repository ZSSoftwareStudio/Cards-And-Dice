const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploader = (folder) => {
  // File upload folder
  const UPLOADS_FOLDER = `./public/${folder}/`;

  // define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (fs.existsSync(UPLOADS_FOLDER)) {
        cb(null, UPLOADS_FOLDER);
      } else {
        fs.mkdir(UPLOADS_FOLDER, (err) => cb(err, UPLOADS_FOLDER));
      }
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // prepare the final multer upload object
  return multer({
    storage: storage,
    limits: {
      fileSize: 1000000000, // 1GB
    },
    fileFilter: (req, file, cb) => {
      if (file === undefined) {
        cb(null, true);
      } else if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg, .png .jpeg format allowed!"));
      }
    },
  });
};

module.exports = uploader;
