const User = require("../../component/user.model");
const Book = require("../../component/book.model");
const IssuedBook = require("../../component/bookIssued.model");
const Logs = require("../../component/logs.model");

const resolvers = {
  Query: {
    getBooks: async (parent, args, context, info) => {
      const { search = null, type } = args;
      let searchQuery = {};
      if (search) {
        switch (type) {
          case "NAME":
            searchQuery = {
              $or: [{ name: { $regex: search, $options: "i" } }],
            };
            break;
          case "AUTHOR":
            searchQuery = {
              $or: [{ author: { $regex: search, $options: "i" } }],
            };
            break;
          case "CATEGORY":
            searchQuery = {
              $or: [{ category: { $regex: search, $options: "i" } }],
            };
            break;
          default:
            searchQuery = {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
              ],
            };
        }
      }
      const response = await Book.find(searchQuery).populate("issued_user");
      for (let item of response) {
        if (item.issued_user) {
          item.issued_user.user_id = item.issued_user["_id"];
        }
      }
      console.log("original", response);
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
        { is_issued: true, issued_user: user_id },
        { new: true }
      );
      const response = await IssuedBook.create(book);
      let logsObj = {
        user_id: response.user_id,
        datetime: response.createdAt,
        book: bookData.name,
        book_id: response.book_id
        
      }
      const logsRes = await Logs.create(logsObj);
      console.log("logs is", logsRes);
      book.date = response.createdAt;
      return book;
    },
  },
};

module.exports = resolvers;
