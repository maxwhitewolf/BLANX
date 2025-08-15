const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const cooldown = new Set();

const createPost = async (req, res) => {
  try {
    const { title, content, location, tags, userId } = req.body;
    let image = "";

    if (!(title && content)) {
      throw new Error("Title and content are required");
    }

    if (cooldown.has(userId)) {
      throw new Error(
        "You are posting too frequently. Please try again shortly."
      );
    }

    cooldown.add(userId);
    setTimeout(() => {
      cooldown.delete(userId);
    }, 60000);

    // Handle uploaded image file with resizing
    if (req.file) {
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const filename = `post_${Date.now()}_${Math.round(Math.random()*1e9)}.jpeg`;
      const filepath = path.join(uploadsDir, filename);
      // Resize and save image
      await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toFile(filepath);
      image = `/uploads/${filename}`;
    }
    // If no image uploaded, leave image as empty string

    // Parse tags if they come as JSON string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(' ').filter(tag => tag.trim());
      }
    }

    const post = await Post.create({
      title,
      content,
      image: image,
      location: location || "",
      tags: parsedTags,
      poster: userId,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("poster", "username avatar fullName");

    res.json(populatedPost);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, location, tags, userId, isAdmin } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post does not exist");
    }
    if (post.poster != userId && !isAdmin) {
      throw new Error("Not authorized to update post");
    }
    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (location) post.location = location;
    if (tags) {
      try {
        post.tags = JSON.parse(tags);
      } catch (e) {
        post.tags = tags.split(' ').filter(tag => tag.trim());
      }
    }
    // Handle uploaded image file with resizing
    if (req.file) {
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      const filename = `post_${Date.now()}_${Math.round(Math.random()*1e9)}.jpeg`;
      const filepath = path.join(uploadsDir, filename);
      await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toFile(filepath);
      post.image = `/uploads/${filename}`;
    }
    post.edited = true;
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPost,
}; 