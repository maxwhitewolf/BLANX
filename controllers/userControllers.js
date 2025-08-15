const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Controller for uploading/updating user avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const userId = req.user._id;
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    const filename = `avatar_${userId}_${Date.now()}.jpeg`;
    const filepath = path.join(uploadsDir, filename);
    // Resize and save avatar
    await sharp(req.file.buffer)
      .resize(256, 256)
      .jpeg({ quality: 80 })
      .toFile(filepath);
    const avatarPath = `/uploads/${filename}`;
    // Update user avatar field
    await User.findByIdAndUpdate(userId, { avatar: avatarPath });
    res.json({ avatar: avatarPath });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadAvatar,
}; 