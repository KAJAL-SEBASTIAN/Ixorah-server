const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
    unique: true,
  },
  userpassword: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userphoneNumber: {
    type: Number,
    required: true,
  },
  userCompanie: {
    type: String,
    required: true,
  },
  userindustry: {
    type: [String],
    required: true,
  },
  resetToken: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
  },
  language: {
    type: String,
  },
  subscription: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
