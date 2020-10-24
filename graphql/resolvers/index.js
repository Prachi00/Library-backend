const User = require("../../component/user.model");
const Book = require("../../component/book.model");

const resolvers = {
  Query: {},
  Mutation: {
    createUser: async (parent, { name, email, phone }, context, info) => {
      const newUser = { name, email, phone };
      const response = await User.create(newUser);
      console.log('response is', response);
      newUser.user_id = response.id;
      return newUser;
    },
    addBook: async (parent, { name, category, author }, context, info) => {
      const newBook = { name, category, author };
      newBook.is_issued = false;
      const response = await Book.create(newBook);
      console.log('books is', response);
      newBook.book_id = response.id;
      return newBook;
    },
  },
};

module.exports = resolvers;
