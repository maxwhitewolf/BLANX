const express = require("express");
const router = express.Router();
const notificationControllers = require("../controllers/notificationControllers");
const { verifyToken } = require("../middleware/auth");

// Get user's notifications
router.get("/", verifyToken, notificationControllers.getUserNotifications);

// Mark notifications as read
router.patch("/mark-read", verifyToken, notificationControllers.markAsRead);

// Get unread count
router.get("/unread-count", verifyToken, notificationControllers.getUnreadCount);

// Delete a notification
router.delete("/:notificationId", verifyToken, notificationControllers.deleteNotification);

module.exports = router; 
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('sender', 'username displayName avatar')
      .populate('post', 'content')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
