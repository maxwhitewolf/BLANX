const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "comment", "follow", "mention"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
    read: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("notification", NotificationSchema); 