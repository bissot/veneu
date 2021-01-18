const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User!]!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
  }

  extend type Subscription {
    userCreated: User!
    userUpdated: User!
  }
`;
