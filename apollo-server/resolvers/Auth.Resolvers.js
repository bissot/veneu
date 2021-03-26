const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");
const nodemailer = require("nodemailer");

const eventName = {
  AUTH_CREATED: "AUTH_CREATED",
  AUTH_UPDATED: "AUTH_UPDATED",
  AUTH_DELETED: "AUTH_DELETED"
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "venue.do.not.reply@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

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
    createAuth: (parent, { role, user, shared_resource, shared_resource_type }, { requester, models: { Auth, User } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");

      console.log(process.env.EMAIL_PASS);

      User.find({email: user}).then(x => {
          // //send email
          let myhtml = ""

          //console.log(process.env.EMAIL_PASS)

          if (process.env.NODE_ENV === "production") {
            myhtml = ''
          } else {
            myhtml = '<p> Yitty Bopkins </p>'
          }

          var mailOptions = {
            from: 'venue.do.not.reply@gmail.com',
            to: 'khartabilt@gmail.com',
            subject: 'PUMPKIN!!!!',
            html: myhtml
          };

          console.log("About to send email with:", mailOptions)
          transporter.sendMail(mailOptions, function (error, info) {
            if (error || info == null) {
              console.log(error);
            } else {
              console.log('Email sent to ' + 'daniel.dukeshire@gmail.com' + ': ' + info.response);
            }
          });
      });

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
