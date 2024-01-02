const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

const {
  register,
  login,
  resetPassword,
  logout,
  refresh,
  protected,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/resetpassword", authMiddleware, resetPassword);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refresh);
router.get("/protected", authMiddleware, protected);

module.exports = router;
