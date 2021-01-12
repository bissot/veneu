const { gql } = require('apollo-server-express')

const typeDefs = gql`

  type User {
    id: Int
    first_name: String!
    last_name: String!
    email: String!
  }

  input UserInput {
    first_name: String!
    last_name: String!
    email: String!
  }

  type Course {
    id: Int!
    title: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(input: UserInput!): User
  }

  type Subscription {
    "When a new user is added"
    userAdded: User!
  }
`

module.exports = typeDefs