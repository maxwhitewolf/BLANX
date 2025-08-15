const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a notification
const createNotification = async (recipientId, senderId, type, postId = null, commentId = null, content = "") => {
  try {
    // Don't create notification if sender is recipient
    if (recipientId.toString() === senderId.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      content,
    });

    // Emit real-time notification
    const { emitNotification, emitUnreadCount } = require("../socketServer");
    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "username avatar")
      .populate("post", "title")
      .populate("comment", "content");
    
    emitNotification(recipientId, populatedNotification);
    
    // Update unread count
    const unreadCount = await Notification.countDocuments({
      recipient: recipientId,
      read: false,
    });
    emitUnreadCount(recipientId, unreadCount);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username avatar")
      .populate("post", "title")
      .populate("comment", "content")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({ recipient: userId });

    res.json({
      notifications,
      total,
      hasMore: total > page * limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationIds } = req.body;

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipient: userId },
        { read: true }
      );
    } else {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification,
}; 