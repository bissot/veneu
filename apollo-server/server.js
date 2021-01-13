// import path from 'path'
// import express from 'express'

// export default app => {
//   app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
// }

const http = require("http");
const express = require("express");

const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("../models");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {}
  }
});
const app = express();

const httpServer = http.createServer(app);

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

models.sequelize.authenticate();
models.sequelize.sync();

httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
