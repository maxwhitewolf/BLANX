const express = require("express");
const router = express.Router();
const searchControllers = require("../controllers/searchControllers");
const { optionallyVerifyToken } = require("../middleware/auth");

// Search posts
router.get("/posts", optionallyVerifyToken, searchControllers.searchPosts);

// Search users
router.get("/users", optionallyVerifyToken, searchControllers.searchUsers);

// Search tags
router.get("/tags", optionallyVerifyToken, searchControllers.searchTags);

// Combined search (posts, users, tags)
router.get("/combined", optionallyVerifyToken, searchControllers.combinedSearch);

module.exports = router; 
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Search users and posts
router.get('/', auth, async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q) {
      return res.json({ users: [], posts: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    let users = [];
    let posts = [];

    if (type === 'all' || type === 'users') {
      users = await User.find({
        $or: [
          { username: searchRegex },
          { displayName: searchRegex }
        ]
      }).select('username displayName avatar followers following').limit(10);
    }

    if (type === 'all' || type === 'posts') {
      posts = await Post.find({
        $or: [
          { content: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      })
      .populate('author', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    }

    res.json({ users, posts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
