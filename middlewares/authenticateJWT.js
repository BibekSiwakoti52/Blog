const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = data.data;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = { authenticateJWT };
