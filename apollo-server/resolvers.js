const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const USER_CREATED = "USER_CREATED";

const resolvers = {
  Query: {
    users: async (root, args, { models }) => {
      return models.user.findAll();
    }
  },
  Mutation: {
    addUser: async (parent, args, { models }) => {
      const user = await models.user.create(args.input);
      await pubsub.publish(USER_CREATED, { userCreated: user });
      return user;
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([USER_CREATED])
    }
  }
};

module.exports = resolvers;
