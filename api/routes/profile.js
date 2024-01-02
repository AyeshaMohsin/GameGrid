// profileRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  myProfile,
  viewProfile,
  updateProfile,
  myFollowers,
  myFollowing,
  deactivateAccount,
  makeAccountPrivate,
  viewFollowers,
  viewFollowing,
} = require("../controllers/profile");

router.get("/myprofile", authMiddleware, myProfile);
router.get("/profile/:userId", authMiddleware, viewProfile);
router.put("/updateprofile", authMiddleware, updateProfile);
router.get("/myfollowers", authMiddleware, myFollowers);
router.get("/myfollowing", authMiddleware, myFollowing);
router.put("/deactivateaccount", authMiddleware, deactivateAccount);
router.put("/makeaccountprivate", authMiddleware, makeAccountPrivate);
router.get("/followers/:userId", authMiddleware, viewFollowers);
router.get("/following/:userId", authMiddleware, viewFollowing);

module.exports = router;
