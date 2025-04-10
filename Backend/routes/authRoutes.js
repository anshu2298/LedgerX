const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  getUserInfo,
  loginUser,
} = require("../controllers/authController.js");
const upload = require("../config/multer.js");
const cloudinary = require("cloudinary");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file Uploaded",
    });
  }
  const image = req.file;
  let result = await cloudinary.uploader.upload(image.path, {
    resource_type: "image",
  });
  const imageUrl = result.secure_url;
  res.status(200).json({
    imageUrl,
  });
});
module.exports = router;
