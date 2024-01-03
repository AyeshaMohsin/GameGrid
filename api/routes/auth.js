const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const passport = require('../config/passport');
const multer = require('multer');
const upload = multer(); 

const {
  register,
  registerMulter,
  login,
  resetPassword,
  logout,
  refresh,
  protected,
  googleFailure,
  googleLogin
} = require("../controllers/auth");

router.post("/register", register);
router.post("/registerMulter", upload.none(), registerMulter);
router.post("/login", login);
router.post("/resetpassword", authMiddleware, resetPassword);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refresh);
router.get("/protected", authMiddleware, protected);
router.get("/googlefailure", googleFailure);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // Use this to start authentication using google
router.get(
  '/google/callback', // This route is accessed after authentication
  passport.authenticate('google', { failureRedirect: 'api/auth/googlefailure' }),
  googleLogin  
);


module.exports = router;
