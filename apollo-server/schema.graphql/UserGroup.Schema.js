const { gql } = require("apollo-server-express");

module.exports = gql`
  type UserGroup implements SharedResource {
    id: ID!
    name: String!
    creator: User!
    parent_resource: SharedResource
    # parent_user_group: UserGroup
    auths: [Auth!]!
    user_groups: [UserGroup!]!
  }

  extend type Query {
    userGroup(id: ID!): UserGroup!
    userGroups: [UserGroup!]!
  }

  extend type Mutation {
    createUserGroup(name: String!): UserGroup!
    updateUserGroup(id: ID!, name: String): UserGroup!
    deleteUserGroup(id: ID!): UserGroup!
  }

  extend type Subscription {
    userGroupCreated: UserGroup!
    userGroupUpdated: UserGroup!
    userGroupDeleted: UserGroup!
  }
`;
