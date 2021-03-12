const { PubSub, AuthenticationError, ForbiddenError } = require("apollo-server-express");

const eventName = {
  LECTURE_CREATED: "LECTURE_CREATED",
  LECTURE_UPDATED: "LECTURE_UPDATED",
  LECTURE_DELETED: "LECTURE_DELETED"
};

module.exports = {
  Query: {
    lecture: (parent, { _id }, { requester, models: { Lecture } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Lecture.findById({ _id });
    },
    lectures: (parent, args, { requester, models: { Lecture } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Lecture.find();
    }
  },
  Mutation: {
    createLecture: (parent, { name, start, end, parent_resource }, { requester, models: { Lecture } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Lecture.create({
        name,
        start,
        end,
        parent_resource,
        creator: requester._id
      }).then(lecture => {
        return global.pubsub.publish(eventName.LECTURE_CREATED, { lectureCreated: lecture }).then(done => {
          return lecture;
        });
      });
    },
    updateLecture(parent, { _id, ...patch }, { requester, models: { Lecture } }, info) {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Lecture.findOneAndUpdate({ _id }, patch, { new: true }).then(lecture => {
        return global.pubsub.publish(eventName.LECTURE_UPDATED, { lectureUpdated: lecture }).then(done => {
          return lecture;
        });
      });
    },
    deleteLecture: (parent, { _id }, { requester, models: { Lecture } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Lecture.findOneAndDelete({ _id }).then(lecture => {
        return global.pubsub.publish(eventName.LECTURE_DELETED, { lectureDeleted: lecture }).then(done => {
          return lecture;
        });
      });
    }
  },
  Subscription: {
    lectureCreated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.LECTURE_CREATED])
    },
    lectureUpdated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.LECTURE_UPDATED])
    },
    lectureDeleted: {
      subscribe: () => global.pubsub.asyncIterator([eventName.LECTURE_DELETED])
    }
  },
  Lecture: {
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    parent_resource: (parent, args, { models: { Course, UserGroup, RegistrationSection } }, info) => {
      return Promise.all([
        Course.findById({ _id: parent.parent_resource }),
        UserGroup.findById({ _id: parent.parent_resource }),
        RegistrationSection.findById({ _id: parent.parent_resource })
      ]).then(res => {
        return res[0] || res[1] || res[2];
      });
    }
  }
};