const { gql } = require("apollo-server-express");

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }

  # directive @auth(requires: Role!) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    INSTRUCTOR
    TEACHING_ASSISTANT
    STUDENT
    OBSERVER
  }

  interface SharedResource {
    id: ID!
    creator: User!
    auths: [Auth!]!
    name: String!
  }

  union SearchResult = User | Course | UserGroup

  scalar Date
`;

module.exports = [
  linkSchema,
  require("./Auth.Schema"),
  require("./Course.Schema"),
  // require("./CourseRole.Schema"),
  require("./Notification.Schema"),
  require("./User.Schema"),
  require("./UserGroup.Schema")
];
