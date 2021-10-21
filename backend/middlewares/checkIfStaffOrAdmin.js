const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role, email, _id } = decoded;

    if (
      role.toLowerCase() === "superuser" ||
      role.toLowerCase() === "staffuser"
    ) {
      req.username = email;
      req.userId = _id;
      next();
    } else {
      next("You need to be a Staff or an Admin user to access the route.");
    }
  } catch (err) {
    next("Authentication failure!");
  }
};

module.exports = checkLogin;
