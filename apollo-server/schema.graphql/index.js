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
    type: String!
  }

  interface CalendarEvent {
    id: ID!
    start: Date!
    end: Date!
    type: String!
  }

  interface CalendarDeadline {
    id: ID!
    due: Date!
    type: String!
  }

  union SearchResult = User | Course | UserGroup

  scalar Date
`;

module.exports = [
  linkSchema,
  require("./Auth.Schema"),
  require("./Course.Schema"),
  require("./Lecture.Schema"),
  require("./Notification.Schema"),
  require("./RegistrationSection.Schema"),
  require("./User.Schema"),
  require("./UserGroup.Schema")
];
