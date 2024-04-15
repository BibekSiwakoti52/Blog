const jwt = require("jsonwebtoken");

// Middleware function to optionally parse JWT token
const optionalTokenParser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {

      if (err) {

        // Redirect to login if token is expired
        if (err.name === "TokenExpiredError") {
          return res.redirect("/auth/login");
        }
        return next();
      }
      req.user = data.data;
      return next();
    });
  } else {
    next();
  }
};

// Exporting the middleware function for use in other parts of the application
module.exports = { optionalTokenParser };
