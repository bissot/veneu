const { ForbiddenError, withFilter } = require("apollo-server-express");

const SharedResourceResolvers = {
  SharedResource: {
    __resolveType: sharedResource => sharedResource.type
  }
};

const CalendarEventResolvers = {
  CalendarEvent: {
    __resolveType: calendarEvent => calendarEvent.type
  }
};

const CalendarDeadlineResolvers = {
  CalendarDeadline: {
    __resolveType: calendarDeadline => calendarDeadline.type
  }
};

const SearchResultResolvers = {
  SearchResult: {
    __resolveType: searchResult => searchResult.type
  }
};

module.exports = [
  {
    Mutation: {
      claimTicket: (parent, ticket, { requester }, info) => {
        return global.pubsub.publish("CLAIMED_TICKET", { claimedTicket: { ticket } }).then(done => {
          return ticket;
        });
      },
      approveTicket: (parent, ticket, { requester }, info) => {
        return global.pubsub.publish("APPROVED_TICKET", { approvedTicket: { ticket } }).then(done => {
          return ticket;
        });
      },
      reserveTicket: (parent, { host, tickets }, { requester }, info) => {
        return global.pubsub.publish("RESERVED_TICKET", { reservedTicket: { host, tickets } }).then(done => {
          return tickets;
        });
      }
    },
    Subscription: {
      claimedTicket: {
        subscribe: withFilter(
          () => global.pubsub.asyncIterator(["CLAIMED_TICKET"]),
          (
            {
              claimedTicket: {
                ticket: { code }
              }
            },
            variables
          ) => code == variables.code
        ),
        resolve({ claimedTicket: { ticket } }) {
          return ticket;
        }
      },
      approvedTicket: {
        subscribe: withFilter(
          () => global.pubsub.asyncIterator(["APPROVED_TICKET"]),
          (
            {
              approvedTicket: {
                ticket: { user }
              }
            },
            variables
          ) => user == variables.user
        ),
        resolve({ approvedTicket: { ticket } }) {
          return ticket;
        }
      },
      reservedTicket: {
        subscribe: withFilter(
          () => global.pubsub.asyncIterator(["RESERVED_TICKET"]),
          ({ reservedTicket: { host } }, variables) => host == variables.host
        ),
        resolve({ reservedTicket: { tickets } }) {
          return tickets;
        }
      }
    }
  },
  SharedResourceResolvers,
  CalendarEventResolvers,
  CalendarDeadlineResolvers,
  SearchResultResolvers,
  require("./Auth.Resolvers"),
  require("./Course.Resolvers"),
  require("./Lecture.Resolvers"),
  require("./Notification.Resolvers"),
  require("./RegistrationSection.Resolvers"),
  require("./User.Resolvers"),
  require("./UserGroup.Resolvers")
];
