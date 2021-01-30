require("dotenv").config();
const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("secret_token");
  if (!token) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.secretJWT);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.json({
      message: "UNAUTHORIZED",
    });
  }
};

module.exports = {
  adminMiddleware,
};
