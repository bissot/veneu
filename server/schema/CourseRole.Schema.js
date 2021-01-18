const { gql } = require("apollo-server-express");

module.exports = gql`
  type CourseRole {
    id: ID!
    role: String!
    user: User!
    course: Course!
  }

  extend type Query {
    courseRole(id: ID!): CourseRole!
    courseRoles: [CourseRole!]!
  }

  extend type Mutation {
    createCourseRole(role: String!, user: ID!, course: ID!): CourseRole!
  }

  extend type Subscription {
    courseRoleCreated: CourseRole!
    courseRoleUpdated: CourseRole!
  }
`;
