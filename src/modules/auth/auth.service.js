const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/env");
const { pool } = require("../../config/db");
const userRepo = require("../users/user.repository");
const AppError = require("../../utils/AppError");
async function login({ username, password }) {
  const user = await userRepo.findByUsername(username);

  if (!user) throw new AppError("Invalid username or password", 401);
  const [[raw]] = await pool.query(
    "SELECT password_hash FROM users WHERE id=?",
    [user.id],
  );
  //   const ok = await bcrypt.compare(password, raw.password_hash);
  //   console.log("ok", ok);

  //   if (!ok) throw new AppError("Invalid username or password", 401);
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role_key: user.role_key,
      parent_id: user.parent_id,
    },
    jwtSecret,
    { expiresIn: "1d" },
  );
  return { token, user };
}
module.exports = { login };
