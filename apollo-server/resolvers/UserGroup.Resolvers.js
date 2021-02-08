const { PubSub, AuthenticationError, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const eventName = {
  USERGROUP_CREATED: "USERGROUP_CREATED",
  USERGROUP_UPDATED: "USERGROUP_UPDATED",
  USERGROUP_DELETED: "USERGROUP_DELETED"
};

module.exports = {
  Query: {
    userGroup: (parent, { id }, { requester, models: { UserGroup } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return UserGroup.findById({ _id: id });
    },
    userGroups: (parent, args, { requester, models: { UserGroup } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return UserGroup.find();
    }
  },
  Mutation: {
    createUserGroup: (parent, { name, creator, ...optional }, { requester, models: { UserGroup } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return UserGroup.create({ name, creator, ...optional }).then(userGroup => {
        return pubsub.publish(eventName.USERGROUP_CREATED, { userGroupCreated: userGroup }).then(done => {
          return userGroup;
        });
      });
    },
    updateUserGroup(parent, { id, ...patch }, { requester, models: { UserGroup } }, info) {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return UserGroup.findOneAndUpdate({ _id: id }, patch, { new: true }).then(userGroup => {
        return pubsub.publish(eventName.USERGROUP_UPDATED, { userGroupUpdated: userGroup }).then(done => {
          return userGroup;
        });
      });
    },
    deleteUserGroup: (parent, { id }, { requester, models: { UserGroup } }, info) => {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return UserGroup.findOneAndDelete({ _id: id }).then(userGroup => {
        return pubsub.publish(eventName.USERGROUP_DELETED, { userGroupDeleted: userGroup }).then(done => {
          return userGroup;
        });
      });
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.USERGROUP_CREATED])
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.USERGROUP_UPDATED])
    },
    userDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.USERGROUP_DELETED])
    }
  },
  UserGroup: {
    parent_resource: (parent, args, { models: { Course, UserGroup } }, info) => {
      return Promise.all(
        Course.findById({ _id: parent.parent_resource }) || UserGroup.findById({ _id: parent.parent_resource })
      );
    },
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    user_groups: (parent, args, { models: { UserGroup } }, info) => {
      return UserGroup.find({ _id: { $in: parent.user_groups } });
    }
  }
};
