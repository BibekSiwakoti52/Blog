const validateRole = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(403);
  }
  // check if the user is an admin user
  if (!user.isAdmin) {
    return res.sendStatus(403);
  }
  return next();
};

module.exports = { validateRole };
