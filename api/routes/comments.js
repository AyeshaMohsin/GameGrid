const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const { authMiddleware } = require('../middleware/auth');

router.get('/view/:blogPostId', commentController.viewCommentsForBlogPost);
router.post('/create-for-blog-post/:blogPostId', authMiddleware, commentController.createForBlogPost);
router.post('/create-for-comment/:commentId', authMiddleware, commentController.createForComment);
router.put('/update/:commentId', authMiddleware, commentController.updateComment);
router.get('/view-comment-with-replies/:commentId', commentController.viewCommentWithReplies);
router.put('/like/:commentId', commentController.likeComment);
router.put('/unlike/:commentId', commentController.unlikeComment);
router.delete('/delete/:commentId', commentController.deleteComment);

module.exports = router;
