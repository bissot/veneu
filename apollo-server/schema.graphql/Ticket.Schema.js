const { gql } = require("apollo-server-express");

module.exports = gql`
  type Ticket {
    code: String!
    user: ID!
    first_name: String!
    last_name: String!
  }

  extend type Mutation {
    claimTicket(code: String!, user: ID!, first_name: String!, last_name: String!): Ticket!
    approveTicket(code: String!, user: ID!, first_name: String!, last_name: String!): Ticket!
  }

  extend type Subscription {
    claimedTicket(code: String!): Ticket!
    approvedTicket(user: ID!): Ticket!
  }
`;
