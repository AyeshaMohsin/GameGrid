const BlogPost = require('../models/BlogPost');

// 1. View all my blogPosts
exports.viewMyBlogPosts = async (req, res) => {
  try {
    const myBlogPosts = await BlogPost.find({ userId: req.user._id });
    res.json(myBlogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. View a specific blog post
exports.viewBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 3. Create a blog post
exports.createBlogPost = async (req, res) => {
  const newBlogPostData = req.body;
  newBlogPostData.userId = req.user._id;

  try {
    const newBlogPost = await BlogPost.create(newBlogPostData);
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 4. Edit one of your blog posts
exports.editBlogPost = async (req, res) => {
  const { blogPostId } = req.params;
  const updatedBlogPostData = req.body;

  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      blogPostId,
      updatedBlogPostData,
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 5. View a specific person's blog posts
exports.viewPersonBlogPosts = async (req, res) => {
  try {
    const personBlogPosts = await BlogPost.find({ userId: req.params.personId });
    res.json(personBlogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 6. Search blogPosts that are not private
exports.searchBlogPosts = async (req, res) => {
  const { keywords, sortByLikes, sortByTime } = req.query;
  const query = {};

  if (keywords) {
    query.$text = { $search: keywords };
  }

  if (sortByLikes) {
    query.private = false;
    const sortOrder = sortByLikes === 'desc' ? -1 : 1;
    query.$orderby = { likes: sortOrder };
  }

  if (sortByTime) {
    query.private = false;
    const sortOrder = sortByTime === 'desc' ? -1 : 1;
    query.$orderby = { createdAt: sortOrder };
  }

  try {
    const searchResults = await BlogPost.find(query);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
