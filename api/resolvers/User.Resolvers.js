const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED"
};

module.exports = {
  Query: {
    user: (parent, { id }, { models: { User } }, info) => {
      return User.findById({ _id: id });
    },
    users: (parent, args, { models: { User } }, info) => {
      return User.find();
    }
  },
  Mutation: {
    createUser: (
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
    },
    deleteUser: (parent, { id }, { models: { User } }, info) => {
      return User.findOneAndDelete({ _id: id }).then(res => res);
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_CREATED])
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_UPDATED])
    }
  },
  User: {
    course_roles: (parent, args, { models: { CourseRole } }, info) => {
      return CourseRole.find({ _id: { $in: parent.course_roles } });
    }
  }
};
