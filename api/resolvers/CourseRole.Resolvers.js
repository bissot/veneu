const { PubSub } = require("apollo-server-express");
const UserSchema = require("../schema/User.Schema");
const pubsub = new PubSub();

const eventName = {
  COURSE_ROLE_CREATED: "COURSE_ROLE_CREATED",
  COURSE_ROLE_UPDATED: "COURSE_ROLE_UPDATED"
};

module.exports = {
  Query: {
    courseRole: (parent, { id }, { models: { CourseRole } }, info) => {
      return CourseRole.findById({ _id: id });
    },
    courseRoles: (parent, args, { models: { CourseRole } }, info) => {
      return CourseRole.find();
    }
  },
  Mutation: {
    createCourseRole: (
      parent,
      { role, user, course },
      { models: { CourseRole, User, Course } },
      info
    ) => {
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
    deleteUser: (parent, { id }, { models: { User } }, info) => {
      return User.deleteOne({ _id: id });
    }
  },
  Subscription: {
    courseRoleCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_CREATED])
    },
    courseRoleUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_UPDATED])
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
