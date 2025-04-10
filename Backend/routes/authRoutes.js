const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  getUserInfo,
  loginUser,
} = require("../controllers/authController.js");
const uploads = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", uploads.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file Uploaded",
    });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({
    imageUrl,
  });
});
module.exports = router;
