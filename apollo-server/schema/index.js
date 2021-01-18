// exports.User = require("./UserSchema");
// exports.Course = require("./CourseSchema");
// exports.CourseRole = require("./CourseRoleSchema");

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
`;

module.exports = [
  linkSchema,
  require("./User.Schema"),
  require("./Course.Schema"),
  require("./CourseRole.Schema")
];
