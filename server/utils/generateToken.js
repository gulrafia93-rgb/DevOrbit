const jwt = require("jsonwebtoken");

// Creates a signed JWT containing the user's id and role.
// This token is what proves a user's identity on future requests.
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;