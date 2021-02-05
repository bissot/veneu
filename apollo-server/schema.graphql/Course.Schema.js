const { gql } = require("apollo-server-express");

module.exports = gql`
  type Course {
    id: ID!
    name: String!
    prefix: String!
    suffix: Int!
    course_roles: [CourseRole!]!
  }

  extend type Query {
    course(id: ID!): Course!
    courses: [Course!]!
  }

  extend type Mutation {
    createCourse(name: String!): Course!
    updateCourse(id: ID!, name: String, prefix: String, suffix: Int): Course!
    deleteCourse(id: ID!): Course!
  }

  extend type Subscription {
    courseCreated: Course!
    courseUpdated: Course!
    courseDeleted: Course!
  }
`;