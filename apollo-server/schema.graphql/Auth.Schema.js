const { gql } = require("apollo-server-express");

module.exports = gql`
  type Auth {
    id: ID!
    user: User
    shared_resource: SharedResource
    role: Role
  }

  extend type Query {
    auth(id: ID!): Auth!
    auths: [Auth!]!
  }

  extend type Mutation {
    createAuth(user: ID, role: Role!): Auth!
    updateAuth(id: ID!, role: Role, user: ID): Auth!
    deleteAuth(id: ID!): Auth!
  }

  extend type Subscription {
    authCreated: Auth!
    authUpdated: Auth!
    authDeleted: Auth!
  }
`;
