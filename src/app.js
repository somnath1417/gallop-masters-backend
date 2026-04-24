const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { frontendUrl } = require("./config/env");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: [frontendUrl, "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) =>
  res.json({ success: true, message: "Gallop Masters API" }),
);
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/hierarchy", require("./modules/hierarchy/hierarchy.routes"));
app.use("/api/wallet", require("./modules/wallet/wallet.routes"));
app.use(errorHandler);
module.exports = app;
