const { PubSub, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  AUTH_CREATED: "AUTH_CREATED",
  AUTH_UPDATED: "AUTH_UPDATED",
  AUTH_DELETED: "AUTH_DELETED"
};

module.exports = {
  Query: {
    auth: (parent, { id }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findById({ _id: id });
    },
    auths: (parent, args, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.find();
    }
  },
  Mutation: {
    createAuth: (parent, { role, user, resource }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.create({ role, user, resource }).then(auth => {
        return pubsub
          .publish(eventName.AUTH_CREATED, {
            authCreated: auth
          })
          .then(done => {
            return auth;
          });
      });
    },
    updateAuth(parent, { id, ...patch }, { requester, models: { Auth } }, info) {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findOneAndUpdate({ _id: id }, patch, {
        new: true
      }).then(auth => {
        return pubsub
          .publish(eventName.AUTH_UPDATED, {
            authUpdated: auth
          })
          .then(done => {
            return auth;
          });
      });
    },
    deleteAuth: (parent, { id }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findOneAndDelete({ _id: id }).then(auth => {
        return pubsub
          .publish(eventName.AUTH_DELETED, {
            authDeleted: auth
          })
          .then(done => {
            return auth;
          });
      });
    }
  },
  Subscription: {
    authCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.AUTH_CREATED])
    },
    authUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.AUTH_UPDATED])
    },
    authDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.AUTH_DELETED])
    }
  },
  Auth: {
    user: async (parent, args, { models: { User } }, info) => {
      return User.findById({ _id: parent.user });
    },
    shared_resource: async (parent, args, { models: { Course, UserGroup, RegistrationSection } }, info) => {
      return Promise.all([
        Course.findById({ _id: parent.shared_resource }),
        UserGroup.findById({ _id: parent.shared_resource }),
        RegistrationSection.findById({ _id: parent.shared_resource })
      ]).then(res => res[0] || res[1] || res[2]);
    }
  }
};
