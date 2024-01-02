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
  followUser,
  unfollowUser
} = require("../controllers/profile");

router.get("/myprofile", authMiddleware, myProfile);
router.get("/profile/:userId", viewProfile); // not private

router.put("/updateprofile", authMiddleware, updateProfile);

router.get("/myfollowers", authMiddleware, myFollowers);
router.get("/myfollowing", authMiddleware, myFollowing);

router.put("/deactivateaccount", authMiddleware, deactivateAccount);
router.put("/makeaccountprivate", authMiddleware, makeAccountPrivate);

router.get("/followers/:userId", viewFollowers); // not private
router.get("/following/:userId", viewFollowing); // not private

router.post("/follow/:userId", authMiddleware, followUser);
router.delete("/unfollow/:userId", authMiddleware, unfollowUser);

module.exports = router;
