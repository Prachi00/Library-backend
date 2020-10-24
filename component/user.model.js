const mongoose = require('mongoose');

const User = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please enter email']
    },
    phone: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', User);