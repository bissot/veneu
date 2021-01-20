const { gql } = require("apollo-server-express");

module.exports = gql`
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
    updateCourseRole(id: ID!, role: Role): CourseRole!
    deleteCourseRole(id: ID!): CourseRole!
  }

  extend type Subscription {
    courseRoleCreated: CourseRole!
    courseRoleUpdated: CourseRole!
    courseRoleDeleted: CourseRole!
  }

  enum Role {
    ADMIN
    INSTRUCTOR
    TEACHING_ASSISTANT
    STUDENT
  }
`;
