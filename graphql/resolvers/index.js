const User = require("../../component/user.model");
const Book = require("../../component/book.model");
const IssuedBook = require("../../component/bookIssued.model");

const resolvers = {
  Query: {
    getBooks: async (parent, args, context, info) => {
      const response = await Book.find({});
      console.log("all books are", response);
      return response;
    },
  },
  Mutation: {
    createUser: async (parent, { name, email, phone }, context, info) => {
      const newUser = { name, email, phone };
      const response = await User.create(newUser);
      console.log("response is", response);
      newUser.user_id = response.id;
      return newUser;
    },
    addBook: async (parent, { name, category, author }, context, info) => {
      const newBook = { name, category, author };
      newBook.is_issued = false;
      const response = await Book.create(newBook);
      console.log("books is", response);
      newBook.book_id = response.id;
      return newBook;
    },
    issueBook: async (parent, { book_id, user_id }, context, info) => {
      const bookData = await Book.findOne({ _id: book_id });
      console.log(bookData);
      if (bookData.is_issued) {
        throw new Error("This book isnt available");
      }
      const book = { book_id, user_id };
      await Book.findOneAndUpdate(
        { _id: book_id },
        { is_issued: true },
        { new: true }
      );
      const response = await IssuedBook.create(book);
      console.log("book issued is", response);
      book.date = response.createdAt;
      return book;
    },
  },
};

module.exports = resolvers;
