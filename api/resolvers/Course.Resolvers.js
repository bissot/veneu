const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_UPDATED: "COURSE_UPDATED"
};

module.exports = {
  Query: {
    course: (parent, { id }, { models: { Course } }, info) => {
      return Course.findById({ _id: id });
    },
    courses: (parent, args, { models: { Course } }, info) => {
      return Course.find();
    }
  },
  Mutation: {
    createCourse: (
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
    },
    deleteCourse: (parent, { id }, { models: { Course } }, info) => {
      return Course.findOneAndDelete({ _id: id }).then(res => res);
    }
  },
  Subscription: {
    courseCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    },
    courseUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    }
  },
  Course: {
    course_roles: (parent, args, { models: { CourseRole } }, info) => {
      return CourseRole.find({ _id: { $in: parent.course_roles } });
    }
  }
};
