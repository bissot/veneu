const { gql } = require("apollo-server-express");

module.exports = gql`
  enum Role {
    ADMIN
    INSTRUCTOR
    TEACHING_ASSISTANT
    STUDENT
  }

  type CourseRole {
    id: ID!
    role: Role!
    user: User!
    course: Course!
  }

  extend type Query {
    courseRole(id: ID!): CourseRole!
    courseRoles: [CourseRole!]!
  }

  extend type Mutation {
    createCourseRole(role: Role!, user: ID!, course: ID!): CourseRole!
  }

  extend type Subscription {
    courseRoleCreated: CourseRole!
    courseRoleUpdated: CourseRole!
  }
`;
