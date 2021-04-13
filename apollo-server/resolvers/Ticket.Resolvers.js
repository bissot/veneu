const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");

module.exports = {
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
  },
  Ticket: {
    checkin: (parent, args, { models: { Checkin } }, info) => {
      return Checkin.find({ _id: parent.checkin });
    }
  }
};
