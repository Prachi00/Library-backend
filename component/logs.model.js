const mongoose = require("mongoose");

const Logs = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "Please enter email"],
  },
  datetime: {
    type: Number,
  },
  book: {
    type: String,
  },
  book_id: {
    type: String,
  },
});

module.exports = mongoose.model("logs", Logs);
