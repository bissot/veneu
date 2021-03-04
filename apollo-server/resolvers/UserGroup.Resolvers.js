const { PubSub, AuthenticationError, ForbiddenError } = require("apollo-server-express");

const eventName = {
  USERGROUP_CREATED: "USERGROUP_CREATED",
  USERGROUP_UPDATED: "USERGROUP_UPDATED",
  USERGROUP_DELETED: "USERGROUP_DELETED"
};

module.exports = {
  Query: {
    userGroup: (parent, { _id }, { requester, models: { UserGroup } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return UserGroup.findById({ _id: _id });
    },
    userGroups: (parent, args, { requester, models: { UserGroup, Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.find({ user: requester._id }).then(auths => {
        return UserGroup.find({ auths: { $in: auths } });
      });
    }
  },
  Mutation: {
    createUserGroup: (parent, { name, parent_resource }, { requester, models: { UserGroup } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return UserGroup.create({ name, creator: requester._id, parent_resource }).then(userGroup => {
        return global.pubsub.publish(eventName.COURSE_CREATED, { userGroupCreated: userGroup }).then(done => {
          return userGroup;
        });
      });
    },
    updateUserGroup(parent, { _id, ...patch }, { requester, models: { UserGroup } }, info) {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return UserGroup.findOneAndUpdate({ _id: _id }, patch, { new: true }).then(userGroup => {
        return global.pubsub.publish(eventName.USERGROUP_UPDATED, { userGroupUpdated: userGroup }).then(done => {
          return userGroup;
        });
      });
    },
    deleteUserGroup: (parent, { _id }, { requester, models: { UserGroup } }, info) => {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return UserGroup.findOneAndDelete({ _id: _id }).then(userGroup => {
        return global.pubsub.publish(eventName.USERGROUP_DELETED, { userGroupDeleted: userGroup }).then(done => {
          return userGroup;
        });
      });
    }
  },
  Subscription: {
    userGroupCreated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USERGROUP_CREATED])
    },
    userGroupUpdated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USERGROUP_UPDATED])
    },
    userGroupDeleted: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USERGROUP_DELETED])
    }
  },
  UserGroup: {
    parent_resource: (parent, args, { models: { Course, UserGroup, RegistrationSection } }, info) => {
      return Promise.all([
        Course.findById({ _id: parent.parent_resource }),
        UserGroup.findById({ _id: parent.parent_resource }),
        RegistrationSection.findById({ _id: parent.parent_resource })
      ]).then(res => {
        return res[0] || res[1] || res[2];
      });
    },
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    user_groups: (parent, args, { models: { UserGroup } }, info) => {
      return UserGroup.find({ _id: { $in: parent.user_groups } });
    },
    lectures: (parent, args, { models: { Lecture } }, info) => {
      return Lecture.find({ _id: { $in: parent.lectures } });
    }
  }
};
