const { gql } = require("apollo-server-express");

module.exports = gql`
  type Lecture implements SharedResource & CalendarEvent {
    _id: ID!
    name: String!
    creator: User!
    type: String!
    auths: [Auth!]!
    start: Date!
    end: Date!
    parent_resource: SharedResource!
  }

  extend type Query {
    lecture(_id: ID!): Lecture!
    lectures: [Lecture!]!
  }

  extend type Mutation {
    createLecture(name: String!, start: Date!, end: Date!, parent_resource: ID!): Lecture!
    updateLecture(_id: ID!, name: String, start: Date, end: Date): Lecture!
    deleteLecture(_id: ID!): Lecture!
  }

  extend type Subscription {
    lectureCreated: Lecture!
    lectureUpdated: Lecture!
    lectureDeleted: Lecture!
  }
`;
