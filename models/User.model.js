const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    // Extra properties: createdAt and updatedAt
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;