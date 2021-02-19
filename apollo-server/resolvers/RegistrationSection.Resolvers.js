const { PubSub, AuthenticationError, ForbiddenError } = require("apollo-server-express");
const pubsub = new PubSub();

const eventName = {
  REGISTRATIONSECTION_CREATED: "REGISTRATIONSECTION_CREATED",
  REGISTRATIONSECTION_UPDATED: "REGISTRATIONSECTION_UPDATED",
  REGISTRATIONSECTION_DELETED: "REGISTRATIONSECTION_DELETED"
};

module.exports = {
  Query: {
    registrationSection: (parent, { id }, { requester, models: { RegistrationSection } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return RegistrationSection.findById({ _id: id });
    },
    registrationSections: (parent, args, { requester, models: { RegistrationSection, Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return requester.then(user => {
        return Auth.find({ user }).then(auths => {
          return RegistrationSection.find({ auths: { $in: auths } });
        });
      });
    }
  },
  Mutation: {
    createRegistrationSection: (
      parent,
      { name, parent_resource },
      { requester, models: { RegistrationSection } },
      info
    ) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return requester.then(creator => {
        return RegistrationSection.create({ name, creator, parent_resource }).then(registrationSection => {
          return pubsub
            .publish(eventName.COURSE_CREATED, { registrationSectionCreated: registrationSection })
            .then(done => {
              return registrationSection;
            });
        });
      });
    },
    updateRegistrationSection(parent, { id, ...patch }, { requester, models: { RegistrationSection } }, info) {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return RegistrationSection.findOneAndUpdate({ _id: id }, patch, { new: true }).then(registrationSection => {
        return pubsub
          .publish(eventName.REGISTRATIONSECTION_UPDATED, { registrationSectionUpdated: registrationSection })
          .then(done => {
            return registrationSection;
          });
      });
    },
    deleteRegistrationSection: (parent, { id }, { requester, models: { RegistrationSection } }, info) => {
      if (!requester || requester._id != id) throw new ForbiddenError("Not allowed");
      return RegistrationSection.findOneAndDelete({ _id: id }).then(registrationSection => {
        return pubsub
          .publish(eventName.REGISTRATIONSECTION_DELETED, { registrationSectionDeleted: registrationSection })
          .then(done => {
            return registrationSection;
          });
      });
    }
  },
  Subscription: {
    registrationSectionCreated: {
      subscribe: () => pubsub.asyncIterator([eventName.REGISTRATIONSECTION_CREATED])
    },
    registrationSectionUpdated: {
      subscribe: () => pubsub.asyncIterator([eventName.REGISTRATIONSECTION_UPDATED])
    },
    registrationSectionDeleted: {
      subscribe: () => pubsub.asyncIterator([eventName.REGISTRATIONSECTION_DELETED])
    }
  },
  RegistrationSection: {
    parent_resource: (parent, args, { models: { Course, RegistrationSection } }, info) => {
      return Course.findById({ _id: parent.parent_resource });
    },
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    user_groups: (parent, args, { models: { UserGroup } }, info) => {
      return UserGroup.find({ _id: { $in: parent.user_groups } });
    }
  }
};
