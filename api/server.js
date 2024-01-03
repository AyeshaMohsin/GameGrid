const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("./config/passport");

// Connect to Mongo Database
const connectDB = require("./config/db");
mongoose.set("strictQuery", true);
try {
  connectDB();
} catch (error) {
  console.log(error);
}


const app = express();
app.use(
  session({
    secret: "testing key",
    resave: false,
    saveUninitialized: false,
  })
);
// Middleware parsers
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

// Setup Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/blogposts", require("./routes/blogPosts"));
app.use("/api/comments", require("./routes/comments"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
