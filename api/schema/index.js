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
  require("./User.Schema"),
  require("./Course.Schema"),
  require("./CourseRole.Schema")
];
