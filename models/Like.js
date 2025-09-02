
const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure unique likes per user per post
LikeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("like", LikeSchema);
