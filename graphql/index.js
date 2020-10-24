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
  }

  type Mutation {
    createUser(name: String, email: String, phone: Int): User!
    addBook(name: String, author: String, category: String): Book!
  }

  type Query {
    users: [User]
  }
`;


module.exports = {typeDefs, resolvers};
