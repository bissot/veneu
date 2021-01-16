const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
  }

  input UserInput {
    first_name: String!
    last_name: String!
    email: String!
  }

  type Course {
    id: ID!
    name: String!
    prefix: String!
    suffix: Int!
  }

  input CourseInput {
    name: String!
    prefix: String!
    suffix: Int!
  }

  type Query {
    users: [User]
    courses: [Course]
  }

  type Mutation {
    addUser(input: UserInput!): User
    addCourse(input: CourseInput!): Course
  }

  type Subscription {
    userCreated: User!
    courseCreated: Course!
  }
`;

module.exports = typeDefs;
