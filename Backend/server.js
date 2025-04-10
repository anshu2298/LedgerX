require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const path = require("path");
const connectCloudinary = require("./config/cloudinary.js");
const port = process.env.PORT;
const url = process.env.DB_URI;
const authRouter = require("./routes/authRoutes.js");
const incomeRouter = require("./routes/incomeRoutes.js");
const expenseRouter = require("./routes/expenseRoutes.js");
const dashboardRouter = require("./routes/dashboardRoutes.js");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/income", incomeRouter);

app.use("/api/v1/expense", expenseRouter);

app.use("/api/v1/dashboard", dashboardRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const start = async () => {
  try {
    connectDB(url).then(() => {
      console.log("Connected to DB....");
    });
    await connectCloudinary();
    app.listen(port, console.log(`Server is running on port: ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
