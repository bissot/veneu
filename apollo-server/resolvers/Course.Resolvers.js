const { PubSub, ForbiddenError } = require("apollo-server-express");
const UserGroupResolvers = require("./UserGroup.Resolvers");
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
      return Course.create({ name, creator: requester, prefix, suffix }).then(course => {
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
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    user_groups: (parent, args, { models: { UserGroup } }, info) => {
      return UserGroup.find({ _id: { $in: parent.user_groups } });
    }
  }
};
