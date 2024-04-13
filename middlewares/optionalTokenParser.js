const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const optionalTokenParser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        next();
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

module.exports = { optionalTokenParser };
