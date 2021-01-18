// import path from 'path'
// import express from 'express'

// export default app => {
//   app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
// }
require("dotenv").config();

const http = require("http");
const express = require("express");

const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("./models");

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
  introspection: process.env.NODE_ENV === "production" ? false : true,
  playground: process.env.NODE_ENV === "production" ? false : true,
  tracing: process.env.NODE_ENV === "production" ? false : true
});
const app = express();

const httpServer = http.createServer(app);

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log("🚝 Express ready at http://localhost:4000");
  console.log(
    "📈 GraphQL ready at http://localhost:4000" + `${server.graphqlPath}`
  );
});
