
const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyToken } = require("../middleware/auth");

// Create post
router.post("/", verifyToken, (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.body.userId = req.user._id;
    next();
  });
}, postControllers.createPost);

// Get all posts
router.get("/", async (req, res) => {
  try {
    const Post = require("../models/Post");
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find()
      .populate("poster", "username avatar fullName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const Post = require("../models/Post");
    const post = await Post.findById(req.params.id)
      .populate("poster", "username avatar fullName");
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike post
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const Post = require("../models/Post");
    const Like = require("../models/Like");
    const { createNotification } = require("../controllers/notificationControllers");
    
    const postId = req.params.id;
    const userId = req.user._id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const existingLike = await Like.findOne({ post: postId, user: userId });
    
    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      res.json({ liked: false });
    } else {
      // Like
      await Like.create({ post: postId, user: userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
      
      // Create notification
      if (post.poster.toString() !== userId.toString()) {
        await createNotification(post.poster, userId, 'like', postId);
      }
      
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const Post = require("../models/Post");
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    if (post.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
