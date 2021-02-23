const { gql } = require("apollo-server-express");

module.exports = gql`
  type UserGroup implements SharedResource {
    id: ID!
    name: String!
    creator: User!
    type: String!
    parent_resource: SharedResource
    auths: [Auth!]!
    user_groups: [UserGroup!]!
    lectures: [Lecture!]!
  }

  extend type Query {
    userGroup(id: ID!): UserGroup!
    userGroups: [UserGroup!]!
  }

  extend type Mutation {
    createUserGroup(name: String!, parent_resource: ID): UserGroup!
    updateUserGroup(id: ID!, name: String): UserGroup!
    deleteUserGroup(id: ID!): UserGroup!
  }

  extend type Subscription {
    userGroupCreated: UserGroup!
    userGroupUpdated: UserGroup!
    userGroupDeleted: UserGroup!
  }
`;
