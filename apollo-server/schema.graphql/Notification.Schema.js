const { gql } = require("apollo-server-express");

module.exports = gql`
  type Notification {
    id: ID!
    text: String!
    redirect: String!
    user: User!
    seen: Boolean!
  }

  extend type Query {
    notification(id: ID!): Notification!
    notification: [Notification!]!
  }

  extend type Mutation {
    createNotification(text: String!, redirect: String!, user: ID!): Notification!
    updateNotification(id: ID!, seen: Boolean!): Notification!
    deleteNotification(id: ID!): Notification!
  }

  extend type Subscription {
    notificationCreated: Notification!
    notificationUpdated: Notification!
    notificationDeleted: Notification!
  }
`;
