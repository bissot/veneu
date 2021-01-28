const models = require("./models");

const jwt = require("jsonwebtoken");
const getUser = token =>
  jwt.verify(token, process.env.JWTAUTH_KEY, function(err, decoded) {
    return err || !decoded ? null : models.User.findById({ _id: decoded._id });
  });

module.exports = async ({ req, connection }) => {
  if (connection) {
    return connection.context;
  } else {
    const auth = (req.headers && req.headers.authorization && req.headers.authorization.split(" ")) || [];
    if (auth.length == 2 && auth[0] == "Bearer") {
      const user = getUser(auth[1]);
      return { requester: user, models };
    } else {
      return { requester: null, models };
    }
  }
};
