const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const optionalTokenParser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if ((err.name = "TokenExpiredError")) {
          return res.redirect("/auth/login");
        }
        console.log(err);
        return next();
      }
      req.user = user;
      return next();
    });
  } else {
    next();
  }
};

module.exports = { optionalTokenParser };
