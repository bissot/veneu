const { PubSub } = require("apollo-server-express");

const pubsub = new PubSub();

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_MODIFIED: "USER_MODIFIED",
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_MODIFIED: "COURSE_MODIFIED",
  COURSE_ROLE_CREATED: "COURSE_ROLE_CREATED",
  COURSE_ROLE_MODIFIED: "COURSE_ROLE_MODIFIED"
};

const resolvers = {
  Query: {
    users: async (root, args, { models }) => {
      return models.User.find();
    },
    courses: async (root, args, { models }) => {
      return models.Course.find();
    },
    courseRoles: async (root, args, { models }) => {
      return models.CourseRole.find();
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
    editUser: async (parent, args, { models }) => {
      return models.User.findByIdAndUpdate(args.input.id, args.input, {
        new: true
      })
        .then(res => {
          return pubsub
            .publish(eventName.USER_MODIFIED, { userModified: res })
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
    },
    addCourseRole: async (parent, args, { models }) => {
      const courseRole = new models.CourseRole(args.input);
      return courseRole
        .save()
        .then(res => {
          return pubsub
            .publish(eventName.COURSE_ROLE_CREATED, {
              courseRoleCreated: courseRole
            })
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
    userModified: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_MODIFIED])
    },
    courseCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_CREATED])
    },
    courseRoleCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.COURSE_ROLE_CREATED])
    }
  }
};

module.exports = resolvers;
