
const express = require("express");
const router = express.Router();
const { canCreate } = require("../services/userService");

router.post("/create", (req, res) => {
  const { parentRole, childRole } = req.body;

  if (!canCreate(parentRole, childRole)) {
    return res.status(400).json({ message: "Invalid hierarchy creation" });
  }

  res.json({ message: "User created successfully" });
});

module.exports = router;
