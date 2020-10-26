const mongoose = require("mongoose");

const Book = new mongoose.Schema({
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
  issued_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("books", Book);
