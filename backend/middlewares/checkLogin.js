const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, _id } = decoded;
      req.username = email;
      req.userId = _id;
      next();
    }
  } catch (err) {
    next("Authentication failure!");
  }
};

module.exports = checkLogin;
