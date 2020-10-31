const User = require("../../component/user.model");
const Book = require("../../component/book.model");
const IssuedBook = require("../../component/bookIssued.model");
const ReservedBook = require("../../component/reservedBooks.model");
const Logs = require("../../component/logs.model");

async function issueBookFun(book_id, user_id) {
  const bookData = await Book.findOne({ _id: book_id });
  console.log("bookData", bookData, book_id);
  let userData = await User.find({ _id: user_id });
  let count = userData.length && userData[0].count ? userData[0].count : 0;
  /* this is 4 as count is updated later in the code */
  if (count > 4) {
    throw new Error("You cant have more than 5 books whoopsie");
  }
  /* if book is already issued */
  if (bookData && bookData.is_issued) {
    throw new Error("This book isnt available");
  }
  /* set is issued to true as book is issued */
  const book = { book_id, user_id };
  await Book.findOneAndUpdate(
    { _id: book_id },
    { is_issued: true, issued_user: user_id },
    { new: true }
  );
  const response = await IssuedBook.create(book);

  /* update book count in users collection */
  const resUserCount = await User.findOneAndUpdate(
    { _id: user_id },
    { count: count + 1 },
    { new: true }
  );

  /* create logs */
  let logsObj = {
    user_id: response.user_id,
    datetime: response.createdAt,
    book: bookData.name,
    book_id: response.book_id,
  };
  const logsRes = await Logs.create(logsObj);
  book.date = response.createdAt;
  return book;
}

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
      return issueBookFun(book_id, user_id);
    },
    returnBook: async (parent, { book_id, user_id }, context, info) => {
      let userData = await User.find({ _id: user_id });
      let count = userData[0].count;

      const res = await Book.findOneAndUpdate(
        { _id: book_id },
        { is_issued: false, issued_user: undefined },
        { new: true }
      );
      const deletedRes = await IssuedBook.findOneAndDelete({
        book_id: book_id,
      });
      if (deletedRes) {
        const resUserCount = await User.findOneAndUpdate(
          { _id: user_id },
          { count: count - 1 },
          { new: true }
        );
      }
      /* get the reserved books in ascending order by timestamp so FIFO is implemented */
      const response = await ReservedBook.find({ book_id: book_id }).sort({
        createdAt: 1,
      });
      console.log("reserved books are", response, book_id);
      if (response.length) {
        issueBookFun(response[0].book_id, response[0].user_id);
        const deletedReservation = await ReservedBook.findOneAndDelete({
          book_id: response[0].book_id,
          user_id: response[0].user_id,
        });
      }

      return "deleted succesfully";
    },
    reserveBook: async (
      parent,
      { book_id, user_id, reserve },
      context,
      info
    ) => {
      const bookData = await Book.findOne({ _id: book_id });
      /* if book is already issued */
      if (bookData.is_issued) {
        /* reserve book */
        if (reserve) {
          const book = { book_id, user_id, reserve };
          const response = await ReservedBook.create(book);
        } else {
          throw new Error("This book isnt available");
        }
      }
      return "reserved";
    },
  },
};

module.exports = resolvers;
