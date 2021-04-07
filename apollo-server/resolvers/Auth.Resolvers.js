const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");
const nodemailer = require("nodemailer");

const eventName = {
  AUTH_CREATED: "AUTH_CREATED",
  AUTH_UPDATED: "AUTH_UPDATED",
  AUTH_DELETED: "AUTH_DELETED"
};

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
    createAuth: (
      parent,
      { role, user, shared_resource, shared_resource_type },
      { requester, models: { Auth, User } },
      info
    ) => {
      if (!requester) throw new ForbiddenError("Not allowed");

      return User.find({ email: user }).then(x => {


        if(x.length == 0){
          console.log("IN IF");
          User.create({email : user}).then(y => {

            var url = "";
            if (process.env.NODE_ENV === "production") {
              url = "https://venue-testing.herokuapp.com/firstlogin/" + y.access_code;
            } else {
              url = "http://localhost:8080/firstlogin/" + y.access_code;
            }

            console.log(url);
            //send email
            let myhtml = "";

            if (process.env.NODE_ENV === "production") {
              myhtml = "";
            } else {
              myhtml = "<p> Shared with new user " + url + " </p>";
            }

            var mailOptions = {
              from: "venue.do.not.reply@gmail.com",
              to: user,
              subject: "New user share",
              html: myhtml
            };

            console.log("SENDING MAIL");
            transporter.sendMail(mailOptions, function(error, info) {
              if (error || info == null) {
                console.log(error);
              } else {
                console.log("Email sent to " + user + ": " + info.response);
              }
            });


            return Auth.create({ role, user: y._id, shared_resource, shared_resource_type }).then(auth => {
              return global.pubsub
                .publish(eventName.AUTH_CREATED, {
                  authCreated: auth
                })
                .then(done => {
                  return auth;
                });
            });

          });
        }
        else{
          console.log("IN ELSE");
          // // //send email
          // let myhtml = "";

          // if (process.env.NODE_ENV === "production") {
          //   myhtml = "";
          // } else {
          //   myhtml = "<p> Yitty Bopkins </p>";
          // }

          // var mailOptions = {
          //   from: "venue.do.not.reply@gmail.com",
          //   to: user,
          //   subject: "PUMPKIN!!!!",
          //   html: myhtml
          // };

          // transporter.sendMail(mailOptions, function(error, info) {
          //   if (error || info == null) {
          //     console.log(error);
          //   } else {
          //     console.log("Email sent to " + user + ": " + info.response);
          //   }
          // });

          return Auth.create({ role, user: x[0]._id, shared_resource, shared_resource_type }).then(auth => {
            return global.pubsub
              .publish(eventName.AUTH_CREATED, {
                authCreated: auth
              })
              .then(done => {
                return auth;
              });
          });
        }
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
      return Auth.findOne({ _id })
        .then(auth => auth.deleteOne())
        .then(auth => {
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
