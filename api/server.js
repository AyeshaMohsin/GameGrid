const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
require("dotenv").config();

// Connect to Mongo Database
const connectDB = require("./config/db");
mongoose.set("strictQuery", true);
try {
  connectDB();
} catch (error) {
  console.log(error);
}

const app = express();
// Middleware parsers
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Setup Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
