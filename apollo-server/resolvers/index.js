const { ForbiddenError, withFilter } = require("apollo-server-express");

const SharedResourceResolvers = {
  SharedResource: {
    __resolveType: sharedResource => sharedResource.type
  }
};

const CalendarizableEventResolvers = {
  CalendarizableEvent: {
    __resolveType: CalendarizableEvent => CalendarizableEvent.type
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
  SharedResourceResolvers,
  CalendarizableEventResolvers,
  CalendarDeadlineResolvers,
  SearchResultResolvers,
  require("./Auth.Resolvers"),
  require("./Checkin.Resolvers"),
  require("./Course.Resolvers"),
  require("./Lecture.Resolvers"),
  require("./Notification.Resolvers"),
  require("./RegistrationSection.Resolvers"),
  require("./Ticket.Resolvers"),
  require("./User.Resolvers"),
  require("./UserGroup.Resolvers")
];
