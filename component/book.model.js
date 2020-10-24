const mongoose = require('mongoose');

const Book = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    author: {
      type: String,
    },
    category: {
      type: String,
    },
    is_issued: {
      type: Boolean,
    },
  },
//   { typeKey: '$type', timestamps: true }
);

module.exports = mongoose.model('books', Book);