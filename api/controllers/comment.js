const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

// View all comments for a specific blog post
exports.viewCommentsForBlogPost = async (req, res) => {
  const { blogPostId } = req.params;

  try {
    // Find the blog post by its ID and populate the commentIds references
    const blogPost = await BlogPost.findById(blogPostId).populate('commentIds');
    
    if (!blogPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Extract comments from the populated commentIds field
    const comments = blogPost.commentIds;

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a comment for a specific blog post
exports.createForBlogPost = async (req, res) => {
  const { blogPostId } = req.params;
  const newCommentData = req.body;
  newCommentData.userId = req.user._id;

  try {
    // Create a new comment
    const newComment = await Comment.create(newCommentData);

    // Find the corresponding blog post and update its commentIds
    const blogPost = await BlogPost.findByIdAndUpdate(
      blogPostId,
      { $push: { commentIds: newComment._id } },
      { new: true }
    );

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a comment reply for a specific Comment
exports.createForComment = async (req, res) => {
  const { commentId } = req.params;
  const newCommentData = req.body;
  newCommentData.userId = req.user._id;

  try {
    const newComment = await Comment.create(newCommentData);
    // Find the corresponding blog post and update its commentIds
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newComment._id } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit a comment
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const updatedCommentData = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updatedCommentData,
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(updatedComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View a comment and its replies
exports.viewCommentWithReplies = async (req, res) => {
  const { commentId } = req.params;

  try {
    const commentWithReplies = await Comment.findById(commentId).populate(
      "replies"
    );

    if (!commentWithReplies) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(commentWithReplies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Increment the likes count
    comment.likes += 1;

    // Save the updated comment
    await comment.save();

    res.status(200).json({ success: true, message: 'Comment liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Unlike a comment
exports.unlikeComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Decrement the likes count, ensuring it doesn't go below 0
    comment.likes = Math.max(0, comment.likes - 1);

    // Save the updated comment
    await comment.save();

    res.status(200).json({ success: true, message: 'Comment unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a comment and its replies
const deleteCommentAndReplies = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return; // Comment not found, nothing to delete
    }

    // Recursively delete replies and their replies
    async function deleteReplies(replyIds) {
      for (const replyId of replyIds) {
        await deleteReplies(comment.replies); // Recursively delete replies of this reply

        // Delete the reply
        await Comment.findByIdAndDelete(replyId);
      }
    }

    await deleteReplies(comment.replies); // Start the deletion process

    // Delete the main comment
    await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
};

// New function to delete a comment and its replies
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await deleteCommentAndReplies(commentId);

    res.status(200).json({ success: true, message: 'Comment and replies deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};