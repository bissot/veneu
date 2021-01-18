const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED"
};

module.exports = {
  Query: {
    user: async (parent, { id }, { models: { User } }, info) => {
      return User.findById({ _id: id });
    },
    users: async (parent, args, { models: { User } }, info) => {
      return User.find();
    }
  },
  Mutation: {
    createUser: async (
      parent,
      { first_name, last_name, email },
      { models: { User } },
      info
    ) => {
      return User.create({ first_name, last_name, email }).then(user => {
        return pubsub
          .publish(eventName.USER_CREATED, { userCreated: user })
          .then(done => {
            return user;
          });
      });
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_CREATED])
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_UPDATED])
    }
  }
};
