require("dotenv").config();
module.exports = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    port: process.env.DB_PORT || "3306",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gallop_masters",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: true,
    },
  },
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
};
