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
  scalar Date
`;

module.exports = [
  linkSchema,
  require("./Course.Schema"),
  require("./CourseRole.Schema"),
  require("./Notification.Schema"),
  require("./User.Schema")
];
