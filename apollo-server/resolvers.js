const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_MODIFIED: "USER_MODIFIED",
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_MODIFIED: "COURSE_MODIFIED"
};

const resolvers = {
  Query: {
    users: async (root, args, { models }) => {
      return models.User.find();
    },
    courses: async (root, args, { models }) => {
      return models.Course.find();
    }
  },
  Mutation: {
    addUser: async (parent, args, { models }) => {
      const user = new models.User(args.input);
      return user
        .save()
        .then(res => {
          return pubsub
            .publish(eventName.USER_CREATED, { userCreated: user })
            .then(done => {
              return res;
            });
        })
        .catch(e => {
          console.log("error:", e);
        });
    },
    addCourse: async (parent, args, { models }) => {
      const course = new models.Course(args.input);
      return course
        .save()
        .then(res => {
          return pubsub
            .publish(eventName.COURSE_CREATED, { courseCreated: course })
            .then(done => {
              return res;
            });
        })
        .catch(e => {
          console.log("error:", e);
        });
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_CREATED])
    },
    courseCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    }
  }
};

module.exports = resolvers;
