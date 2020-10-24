const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../graphql/index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = server;