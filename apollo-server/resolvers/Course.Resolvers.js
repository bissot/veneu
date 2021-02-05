const { PubSub, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_UPDATED: "COURSE_UPDATED",
  COURSE_DELETED: "COURSE_DELETED"
};

module.exports = {
  Query: {
    course: (parent, { id }, { requester, models: { Course } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Course.findById({ _id: id });
    },
    courses: (parent, args, { requester, models: { Course } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Course.find();
    }
  },
  Mutation: {
    createCourse: (parent, { name, prefix, suffix }, { requester, models: { Course } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Course.create({ name, prefix, suffix }).then(course => {
        return pubsub.publish(eventName.COURSE_CREATED, { courseCreated: course }).then(done => {
          return course;
        });
      });
    },
    updateCourse(parent, { id, ...patch }, { requester, models: { Course } }, info) {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Course.findOneAndUpdate({ _id: id }, patch, {
        new: true
      }).then(course => {
        return pubsub
          .publish(eventName.COURSE_UPDATED, {
            courseUpdated: course
          })
          .then(done => {
            return course;
          });
      });
    },
    deleteCourse: (parent, { id }, { requester, models: { Course } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Course.findOneAndDelete({ _id: id }).then(course => {
        return pubsub
          .publish(eventName.COURSE_DELETED, {
            courseDeleted: course
          })
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
    },
    courseDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_DELETED])
    }
  },
  Course: {
    course_roles: (parent, args, { models: { CourseRole } }, info) => {
      return CourseRole.find({ _id: { $in: parent.course_roles } });
    }
  }
};