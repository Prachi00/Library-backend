const mongoose = require('mongoose');

module.exports = async () => {
  const connection = await mongoose.connect('mongodb+srv://prachirai:4cvsq75d5VxXipnV@cluster1.srrdm.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  return connection.connection.db;
};