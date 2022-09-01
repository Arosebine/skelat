const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    bank_account:{
      type: String,
    },

    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
