const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");

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
      claimTicket: (parent, { code }, { requester }, info) => {
        return global.pubsub.publish("CLAIMED_TICKED", { claimedTicket: { code } }).then(done => {
          console.log("claimed");
          return code;
        });
      },
      approveTicket: (parent, { code }, { requester }, info) => {
        return global.pubsub.publish("APPROVED_TICKED", { approvedTicket: { code } }).then(done => {
          return code;
        });
      }
    },
    Subscription: {
      claimedTicket: {
        subscribe: withFilter(
          () => global.pubsub.asyncIterator(["CLAIMED_TICKED"]),
          (payload, variables) => payload.claimedTicket.code == variables.code
        ),
        resolve(payload) {
          return payload.claimedTicket.code;
        }
      },
      approvedTicket: {
        subscribe: withFilter(
          () => global.pubsub.asyncIterator(["APPROVED_TICKED"]),
          (payload, variables) => payload.approvedTicket.code == variables.code
        )
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
