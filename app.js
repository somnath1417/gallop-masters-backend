
const express = require("express");
const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");

app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
