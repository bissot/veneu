const { PubSub, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  COURSE_ROLE_CREATED: "COURSE_ROLE_CREATED",
  COURSE_ROLE_UPDATED: "COURSE_ROLE_UPDATED",
  COURSE_ROLE_DELETED: "COURSE_ROLE_DELETED"
};

module.exports = {
  Query: {
    courseRole: (parent, { id }, { requester, models: { CourseRole } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return CourseRole.findById({ _id: id });
    },
    courseRoles: (parent, args, { requester, models: { CourseRole } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return CourseRole.find();
    }
  },
  Mutation: {
    createCourseRole: (parent, { role, user, course }, { requester, models: { CourseRole } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return CourseRole.create({ role, user, course }).then(courseRole => {
        return pubsub
          .publish(eventName.COURSE_ROLE_CREATED, {
            courseRoleCreated: courseRole
          })
          .then(done => {
            return courseRole;
          });
      });
    },
    updateCourseRole(parent, { id, ...patch }, { requester, models: { CourseRole } }, info) {
      if (!requester) throw new ForbiddenError("Not allowed");
      return CourseRole.findOneAndUpdate({ _id: id }, patch, {
        new: true
      }).then(courseRole => {
        return pubsub
          .publish(eventName.COURSE_ROLE_UPDATED, {
            courseRoleUpdated: courseRole
          })
          .then(done => {
            return courseRole;
          });
      });
    },
    deleteCourseRole: (parent, { id }, { requester, models: { CourseRole } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return CourseRole.findOneAndDelete({ _id: id }).then(courseRole => {
        return pubsub
          .publish(eventName.COURSE_ROLE_DELETED, {
            courseRoleDeleted: courseRole
          })
          .then(done => {
            return courseRole;
          });
      });
    }
  },
  Subscription: {
    courseRoleCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_CREATED])
    },
    courseRoleUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_UPDATED])
    },
    courseRoleDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_DELETED])
    }
  },
  CourseRole: {
    user: async (parent, args, { models: { User } }, info) => {
      return User.findById({ _id: parent.user });
    },
    course: async (parent, args, { models: { Course } }, info) => {
      return Course.findById({ _id: parent.course });
    }
  }
};
