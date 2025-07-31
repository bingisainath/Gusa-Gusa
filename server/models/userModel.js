
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide name"],
    },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s-]{10,}$/, "provide a valid phone number"],
    },
    DOB: {
      type: Date,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other",""],
    },
    profile_pic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    socialIds: {
      google: { type: String },
      facebook: { type: String },
    },
    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);


// const UserModel = mongoose.model("User", userSchema);

// module.exports = UserModel;
