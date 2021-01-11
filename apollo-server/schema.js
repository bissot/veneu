const { gql } = require('apollo-server-express')

const typeDefs = gql`

  type User {
    id: Int!
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

  # type Mutation {
    
  # }
`

module.exports = typeDefs