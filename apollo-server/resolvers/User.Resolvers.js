const { AuthenticationError, ForbiddenError } = require("apollo-server-express");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const { GMAIL_OAUTH_ID, GMAIL_OAUTH_SECRET, GMAIL_OAUTH_REFRESH } = process.env;
const oauth2Client = new OAuth2(GMAIL_OAUTH_ID, GMAIL_OAUTH_SECRET, OAUTH_PLAYGROUND);

const eventName = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED"
};

module.exports = {
  Query: {
    user: (parent, { _id }, { requester, models: { User } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return User.findById({ _id: _id });
    },
    users: (parent, args, { requester, models: { User } }, info) => {
      if (!requester) throw new ForbiddenError("Not allowed");
      return User.find();
    },
    me: (parent, args, context, info) =>
      module.exports.Query.user(parent, { ...args, _id: context.requester._id }, context, info)
  },
  Mutation: {
    createUser: (parent, { email }, { models: { User } }, info) => {
      return User.create({
        email
      }).then(user => {
        oauth2Client.setCredentials({
          refresh_token: GMAIL_OAUTH_REFRESH
        });
        const accessToken = oauth2Client.getAccessToken();
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "venue.do.not.reply@gmail.com",
            clientId: GMAIL_OAUTH_ID,
            clientSecret: GMAIL_OAUTH_SECRET,
            refreshToken: GMAIL_OAUTH_REFRESH,
            accessToken
          }
        });
        if (transporter) {
          var mailOptions = {
            from: "venue.do.not.reply@gmail.com",
            to: email,
            subject: "Venue Account Creation",
            html:
              '<p>Click <a href="' +
              process.env.BASE_URL +
              "firstlogin/" +
              user.access_code +
              '">here</a> to continue Sign-up for Venue.</p>'
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error || info == null) {
              console.log(error);
            } else {
              console.log("Email sent to " + user + ": " + info.response);
            }
          });
        } else {
          console.log("MAILER FAILED");
        }

        return global.pubsub.publish(eventName.USER_CREATED, { userCreated: user }).then(done => {
          return user;
        });
      });
    },
    updateUser(parent, { _id, ...patch }, { requester, models: { User } }, info) {
      if (!requester || requester._id != _id) throw new ForbiddenError("Not allowed");
      return User.findOneAndUpdate({ _id }, patch, { new: true }).then(user => {
        return global.pubsub.publish(eventName.USER_UPDATED, { userUpdated: user }).then(done => {
          return user;
        });
      });
    },
    deleteUser: (parent, { _id }, { requester, models: { User } }, info) => {
      if (!requester || requester._id != _id) throw new ForbiddenError("Not allowed");
      return User.findOne({ _id })
        .then(user => user.deleteOne())
        .then(user => {
          return global.pubsub.publish(eventName.USER_DELETED, { userDeleted: user }).then(done => {
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
    },
    firstLogin(parent, { access_code, password, first_name, last_name }, { models: { User } }, info) {
      return bcrypt.hash(password, saltRounds).then(hash => {
        return User.updateOne(
          { access_code },
          {
            first_name: first_name,
            last_name: last_name,
            password: hash,
            access_code: null,
            active: true
          },
          { new: true }
        ).then(user => {
          if (user) {
            return true;
          }
          return false;
        });
      });
    }
  },
  Subscription: {
    userCreated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USER_CREATED])
    },
    userUpdated: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USER_UPDATED])
    },
    userDeleted: {
      subscribe: () => global.pubsub.asyncIterator([eventName.USER_DELETED])
    }
  },
  User: {
    notifications: (parent, args, { models: { Notification } }, info) => {
      return Notification.find({ _id: { $in: parent.notifications } });
    },
    auths: (parent, args, { models: { Auth } }, info) => {
      return Auth.find({ _id: { $in: parent.auths } });
    },
    name: (parent, args, context, info) => {
      return parent.first_name + " " + parent.last_name;
    }
  }
};
