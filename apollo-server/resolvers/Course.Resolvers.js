const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_UPDATED: "COURSE_UPDATED"
};

module.exports = {
  Query: {
    course: async (parent, { id }, { models: { Course } }, info) => {
      return Course.findById({ _id: id });
    },
    courses: async (parent, args, { models: { Course } }, info) => {
      return Course.find();
    }
  },
  Mutation: {
    createCourse: async (
      parent,
      { name, prefix, suffix },
      { models: { Course } },
      info
    ) => {
      return Course.create({ name, prefix, suffix }).then(course => {
        return pubsub
          .publish(eventName.COURSE_CREATED, { courseCreated: course })
          .then(done => {
            return course;
          });
      });
    }
  },
  Subscription: {
    courseCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    },
    courseUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    }
  }
};
