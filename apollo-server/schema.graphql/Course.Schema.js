const { gql } = require("apollo-server-express");

module.exports = gql`
  type Course implements SharedResource & CalendarEvent {
    id: ID!
    name: String!
    creator: User!
    type: String!
    prefix: String
    suffix: Int
    auths: [Auth!]!
    start: Date!
    end: Date!
    user_groups: [UserGroup!]!
    registration_sections: [RegistrationSection!]!
    lectures: [Lecture!]!
  }

  extend type Query {
    course(id: ID!): Course!
    courses: [Course!]!
  }

  extend type Mutation {
    createCourse(name: String!, start: Date!, end: Date!, prefix: String, suffix: String): Course!
    updateCourse(id: ID!, name: String, prefix: String, suffix: Int): Course!
    deleteCourse(id: ID!): Course!
  }

  extend type Subscription {
    courseCreated: Course!
    courseUpdated: Course!
    courseDeleted: Course!
  }
`;
