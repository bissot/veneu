const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");

const eventName = {
  AUTH_CREATED: "AUTH_CREATED",
  AUTH_UPDATED: "AUTH_UPDATED",
  AUTH_DELETED: "AUTH_DELETED"
};

module.exports = {
  Query: {
    auth: (parent, { _id }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findById({ _id: _id });
    },
    auths: (parent, args, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return requester.auths;
    }
  },
  Mutation: {
    createAuth: (parent, { role, user, shared_resource, shared_resource_type }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.create({ role, user, shared_resource, shared_resource_type }).then(auth => {
        return global.pubsub
          .publish(eventName.AUTH_CREATED, {
            authCreated: auth
          })
          .then(done => {
            return auth;
          });
      });
    },
    updateAuth(parent, { _id, ...patch }, { requester, models: { Auth } }, info) {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findOneAndUpdate({ _id: _id }, patch, {
        new: true
      }).then(auth => {
        return global.pubsub
          .publish(eventName.AUTH_UPDATED, {
            authUpdated: auth
          })
          .then(done => {
            return auth;
          });
      });
    },
    deleteAuth: (parent, { _id }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findOneAndDelete({ _id: _id }).then(auth => {
        return global.pubsub
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
      subscribe: withFilter(
        () => global.pubsub.asyncIterator([eventName.AUTH_CREATED]),
        (payload, variables) => payload.authCreated.user == variables.user
      ),
      resolve: (payload, variables, context, info) => {
        return payload.authCreated;
      }
    }
  },
  Auth: {
    user: async (parent, args, { models: { User } }, info) => User.findById({ _id: parent.user }),
    shared_resource: async (parent, args, { models }, info) =>
      models["" + parent.shared_resource_type].findById({ _id: parent.shared_resource })
  }
};
