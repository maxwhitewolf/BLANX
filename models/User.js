
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    followers: [{
      type: mongoose.Types.ObjectId,
      ref: "user",
    }],
    following: [{
      type: mongoose.Types.ObjectId,
      ref: "user",
    }],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search
UserSchema.index({ username: 1, email: 1 });
UserSchema.index({ username: 'text', fullName: 'text' });

module.exports = mongoose.model("user", UserSchema);
