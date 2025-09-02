
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Get post comments
router.get("/post/:postId", async (req, res) => {
  try {
    const Comment = require("../models/Comment");
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username avatar fullName")
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const Comment = require("../models/Comment");
    const Post = require("../models/Post");
    const { createNotification } = require("../controllers/notificationControllers");
    
    const { content, postId } = req.body;
    const userId = req.user._id;
    
    if (!content || !postId) {
      return res.status(400).json({ error: "Content and post ID are required" });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const comment = await Comment.create({
      content,
      post: postId,
      author: userId,
    });
    
    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    
    // Create notification
    if (post.poster.toString() !== userId.toString()) {
      await createNotification(post.poster, userId, 'comment', postId, comment._id);
    }
    
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username avatar fullName");
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const Comment = require("../models/Comment");
    const Post = require("../models/Post");
    
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
