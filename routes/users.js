const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");

// Profile picture upload
router.post("/avatar", verifyToken, (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, userControllers.uploadAvatar);

module.exports = router; 