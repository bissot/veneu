const { gql } = require("apollo-server-express");

module.exports = gql`
  type RegistrationSection implements SharedResource {
    id: ID!
    name: String!
    creator: User!
    type: String!
    parent_resource: SharedResource
    auths: [Auth!]!
    user_groups: [UserGroup!]!
  }

  extend type Query {
    registrationSection(id: ID!): RegistrationSection!
    registrationSections: [RegistrationSection!]!
  }

  extend type Mutation {
    createRegistrationSection(name: String!, parent_resource: ID): RegistrationSection!
    updateRegistrationSection(id: ID!, name: String): RegistrationSection!
    deleteRegistrationSection(id: ID!): RegistrationSection!
  }

  extend type Subscription {
    registrationSectionCreated: RegistrationSection!
    registrationSectionUpdated: RegistrationSection!
    registrationSectionDeleted: RegistrationSection!
  }
`;
