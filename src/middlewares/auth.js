const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
module.exports = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token)
    return res.status(401).json({ success: false, message: "Token required" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
