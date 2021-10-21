const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role, email, _id } = decoded;

    if (role.toLowerCase() === "superuser") {
      req.username = email;
      req.userId = _id;
      next();
    } else {
      next("You need to be an Admin to access the route.");
    }
  } catch (err) {
    next("Authentication failure!");
  }
};

module.exports = checkLogin;
