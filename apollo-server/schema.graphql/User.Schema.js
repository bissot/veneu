const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    password: String
    auths: [Auth!]!
    notifications: [Notification!]!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User!]!
    me: User
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!, password: String!): User!
    updateUser(id: ID!, first_name: String, last_name: String, email: String): User!
    deleteUser(id: ID!): User!
    login(email: String!, password: String!): String!
  }

  extend type Subscription {
    userCreated: User!
    userUpdated: User!
    userDeleted: User!
  }
`;
