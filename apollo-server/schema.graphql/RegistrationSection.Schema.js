const { gql } = require("apollo-server-express");

module.exports = gql`
  type RegistrationSection implements SharedResource {
    _id: ID!
    name: String!
    creator: User!
    type: String!
    course: Course!
    auths: [Auth!]!
    user_groups: [UserGroup!]!
    lectures: [Lecture!]!
  }

  extend type Query {
    registrationSection(_id: ID!): RegistrationSection!
    registrationSections: [RegistrationSection!]!
  }

  extend type Mutation {
    createRegistrationSection(name: String!, course: ID!): RegistrationSection!
    updateRegistrationSection(_id: ID!, name: String): RegistrationSection!
    deleteRegistrationSection(_id: ID!): RegistrationSection!
  }

  extend type Subscription {
    registrationSectionCreated: RegistrationSection!
    registrationSectionUpdated: RegistrationSection!
    registrationSectionDeleted: RegistrationSection!
  }
`;
