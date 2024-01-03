const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

// Create a new blog post for the current user
exports.create = async (req, res) => {
  try {
    const { title, description, images, audio, video, private, keywords } =
      req.body;
    const newBlogPost = new BlogPost({
      title,
      description,
      images,
      audio,
      video,
      userId: req.user._id,
      private: private || false,
      keywords: keywords || [],
    });

    const savedBlogPost = await newBlogPost.save();
    res.status(201).json({sucess: true, savedBlogPost});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all blogPosts for the current user
exports.myBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ userId: req.user._id });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get blogPosts for a specific user
exports.userBlogPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blogPosts = await BlogPost.find({ userId });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a blogPost for the current user
exports.update = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await BlogPost.findOneAndUpdate(
      { _id: postId, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search blogPosts by keywords in the keywords array
exports.searchByKeywords = async (req, res) => {
  try {
    const { keywords, sortBy } = req.query;

    const searchQuery = {
      keywords: { $in: keywords },
    };

    const blogPosts = await BlogPost.find(searchQuery).sort({ [sortBy]: -1 });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search blogPosts using regex in title or description
exports.searchByRegex = async (req, res) => {
  try {
    const { regex, sortBy } = req.query;

    const searchQuery = {
      $or: [
        { title: { $regex: regex, $options: "i" } },
        { description: { $regex: regex, $options: "i" } },
      ],
    };

    const blogPosts = await BlogPost.find(searchQuery).sort({ [sortBy]: -1 });
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a blog post and its related comments recursively
exports.delete = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the blog post and populate the commentIds field
    const blogPost = await BlogPost.findById(postId).populate("commentIds");

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Recursively delete comments
    await deleteCommentsRecursively(blogPost.commentIds);

    // Delete the blog post after deleting comments
    await BlogPost.findByIdAndDelete(postId);

    res.json({ message: "Blog post and related comments deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to delete comments recursively
async function deleteCommentsRecursively(commentIds) {
  for (const commentId of commentIds) {
    // Find the comment and populate the replies field
    const comment = await Comment.findById(commentId).populate("replies");

    if (comment) {
      // Recursively delete replies
      await deleteCommentsRecursively(comment.replies);

      // Delete the comment
      await Comment.findByIdAndDelete(commentId);
    }
  }
}