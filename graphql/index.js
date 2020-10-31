const { gql } = require('apollo-server');
const resolvers = require('./resolvers');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    name: String
    email: String
    phone: Int
    user_id: String
  }

  type Book {
    name: String
    is_issued: Boolean
    book_id: String
    author: String
    category: String
    issued_user: User
  }

  type Bookissued {
    book_id: String
    user_id: String
    date: String
  }

  type Mutation {
    createUser(name: String, email: String, phone: Int): User!
    addBook(name: String, author: String, category: String): Book!
    issueBook(user_id: String, book_id: String, reserve: Boolean): Bookissued!
    returnBook(user_id: String, book_id: String): Bookissued
    reserveBook(user_id: String, book_id: String, reserve: Boolean): Bookissued!
  }

  type Query {
    users: [User]
    getBooks(type: String, search: String, page: Int, limit: Int): [Book]
  }
`;


module.exports = {typeDefs, resolvers};
