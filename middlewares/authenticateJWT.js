const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  // Extracting JWT token from request cookies
  const token = req.cookies.jwt;
  
  if (token) {
    // Verifying token with JWT_SECRET from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {

      if (err) {
        return res.sendStatus(403); //forbidden  status
      }

      // Attaching user data from decoded token to request object
      req.user = data.data;
      next();
    });
  } else {
    res.sendStatus(401); 
  }
};


module.exports = { authenticateJWT };
