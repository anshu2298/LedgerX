const jwt = require("jsonwebtoken");
const User = require("../modals/user.js");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
const registerUser = async (req, res) => {
  const { fullname, password, email, profileImageUrl } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const user = await User.create({
      email,
      fullname,
      password,
      profileImageUrl,
    });
    res.status(201).json({
      success: true,
      message: "Welcome",
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};
const loginUser = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePasswords(password))) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Welcome",
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Loging in user",
      error: err.message,
    });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user info" });
  }
};

module.exports = {
  registerUser,
  getUserInfo,
  loginUser,
};
