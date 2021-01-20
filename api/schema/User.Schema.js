const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    course_roles: [CourseRole!]!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User!]!
  }

  extend type Mutation {
    createUser(first_name: String!, last_name: String!, email: String!): User!
    updateUser(
      id: ID!
      first_name: String
      last_name: String
      email: String
    ): User!
    deleteUser(id: ID!): User!
  }

  extend type Subscription {
    userCreated: User!
    userUpdated: User!
    userDeleted: User!
  }
`;
