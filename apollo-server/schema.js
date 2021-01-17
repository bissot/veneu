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

  input UserEdit {
    id: ID!
    first_name: String
    last_name: String
  }

  input PasswordChangeInput {
    email: String!
    old_password: String!
    new_password: String!
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

  enum Role {
    INSTRUCTOR
    TEACHING_ASSISTANT
    STUDENT
  }

  type CourseRole {
    role: Role!
    user: ID!
    course: ID!
  }

  input CourseRoleInput {
    role: Role!
    user: ID!
    course: ID!
  }

  type Query {
    users: [User]
    courses: [Course]
    courseRoles: [CourseRole]
  }

  type Mutation {
    addUser(input: UserInput!): User
    editUser(input: UserEdit!): User
    addCourse(input: CourseInput!): Course
    addCourseRole(input: CourseRoleInput!): CourseRole
  }

  type Subscription {
    userCreated: User!
    userModified: User!
    courseCreated: Course!
    courseRoleCreated: CourseRole!
  }
`;

module.exports = typeDefs;
