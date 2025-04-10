const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedHeaders = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedHeaders.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg .jpg .png formats are allowed"), false);
  }
};

const uploads = multer({ storage, fileFilter });

module.exports = uploads;
