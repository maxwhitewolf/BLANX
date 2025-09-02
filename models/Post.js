
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    image: {
      type: String,
      default: "",
    },
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    location: {
      type: String,
      default: "",
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search and performance
PostSchema.index({ poster: 1, createdAt: -1 });
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });
PostSchema.index({ tags: 1 });

module.exports = mongoose.model("post", PostSchema);
