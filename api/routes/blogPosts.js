const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const blogPostController = require('../controllers/blogPost');

router.post('/create', authMiddleware, blogPostController.create);
router.get('/my-blog-posts', authMiddleware, blogPostController.myBlogPosts);
router.get('/user-blog-posts/:userId', blogPostController.userBlogPosts);
router.put('/update/:postId', authMiddleware, blogPostController.update);
router.get('/search-keywords', authMiddleware, blogPostController.searchByKeywords);
router.get('/search', authMiddleware, blogPostController.searchByRegex);
router.delete('/delete/:postId', authMiddleware, blogPostController.delete);

module.exports = router;
