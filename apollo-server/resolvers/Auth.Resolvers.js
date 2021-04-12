const { PubSub, ForbiddenError, withFilter } = require("apollo-server-express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const fs = require('fs');
const hbs = require('nodemailer-express-handlebars');

const eventName = {
  AUTH_CREATED: "AUTH_CREATED",
  AUTH_UPDATED: "AUTH_UPDATED",
  AUTH_DELETED: "AUTH_DELETED"
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "venue.do.not.reply@gmail.com",
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  Query: {
    auth: (parent, { _id }, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return Auth.findById({ _id: _id });
    },
    auths: (parent, args, { requester, models: { Auth } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      if (args.shared_resource) {
        return Auth.find({ shared_resource: args.shared_resource }).then(auths => {
          return auths;
        });
      } else {
        return requester.auths;
      }
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
        if (x.length == 0) {
          User.create({ email: user }).then(y => {
            var mailOptions = {
              from: "venue.do.not.reply@gmail.com",
              to: user,
              subject: "You have been added to a Venue course",
              html:
                '<p>Click <a href="' +
                process.env.BASE_URL +
                "firstlogin/" +
                y.access_code +
                '">here</a> to continue Sign-up for Venue.</p>'
            };

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
        } else {
          let myhtml = "";

          mongoose.model(shared_resource_type).findOne({_id: shared_resource}).then(y => {
            var tempCourse = y.name;
            var tempName = requester.first_name + " " + requester.last_name;

            if (process.env.NODE_ENV === "production") {
              myhtml = "";
            } else {
              myhtml =  "<p> You have been made a(n) " + role + " for " + shared_resource_type + " '" + tempCourse + "' by " + tempName + "</p>"

            }

            transporter.use('compile', hbs({
              viewEngine: {
                extName: '.handlebars',
                partialsDir: './email_templates/',
                layoutsDir: './email_templates/',
                defaultLayout: ''
              },
              viewPath: './email_templates/',
              extName: '.handlebars'
            }));

            var mailOptions = {
              from: "venue.do.not.reply@gmail.com",
              to: user,
              subject: "You have been invited to Venue!",
              template: 'main',
              context: {
                name: requester.first_name,
                role: role.toLowerCase(),
                type: shared_resource_type.toLowerCase(),
                course: tempCourse,
                instructor: tempName
              },
              attachments: [{
                filename: 'venue-logo.png',
                path: './email_templates/venue-logo.png',
                cid: 'logo'
              }]
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error || info == null) {
                console.log(error);
              } else {
                console.log("Email sent to " + user + ": " + info.response);
              }
            });
          });

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
