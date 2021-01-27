const { PubSub, AuthenticationError, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED"
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
    createUser: (parent, { first_name, last_name, email, password }, { models: { User } }, info) => {
      return bcrypt
        .hash(password, saltRounds)
        .then(hash => {
          return User.create({
            first_name,
            last_name,
            email,
            password: hash
          });
        })
        .then(user => {
          return pubsub.publish(eventName.USER_CREATED, { userCreated: user }).then(done => {
            return user;
          });
        });
    },
    updateUser(parent, { id, ...patch }, { requester, models: { User } }, info) {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return User.findOneAndUpdate({ _id: id }, patch, { new: true }).then(user => {
        return pubsub.publish(eventName.USER_UPDATED, { userUpdated: user }).then(done => {
          return user;
        });
      });
    },
    deleteUser: (parent, { id }, { requester, models: { User } }, info) => {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return User.findOneAndDelete({ _id: id }).then(user => {
        return pubsub.publish(eventName.USER_DELETED, { userDeleted: user }).then(done => {
          return user;
        });
      });
    },
    login(parent, { email, password }, { models: { User } }, info) {
      return User.findOne({ email }).then(user => {
        if (!user) throw new AuthenticationError("Bad credentials");
        return bcrypt.compare(password, user.password).then(hash => {
          if (!hash) throw new AuthenticationError("Bad credentials");
          return jwt.sign({ _id: user._id }, process.env.JWTAUTH_KEY);
        });
      });
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_CREATED])
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_UPDATED])
    },
    userDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.USER_DELETED])
    }
  },
  User: {
    course_roles: (parent, args, { models: { CourseRole } }, info) => {
      return CourseRole.find({ _id: { $in: parent.course_roles } });
    }
  }
};
