const mongoose = require('mongoose');

const booksIssued = new mongoose.Schema(
  {
    book_id: {
      type: String,
    },
    user_id: {
      type: String,
    }
  },
  { timestamps: true }
);

booksIssued.index({ book_id: 1, user_id: 1}, { unique: true });


module.exports = mongoose.model('IssuedBook', booksIssued);