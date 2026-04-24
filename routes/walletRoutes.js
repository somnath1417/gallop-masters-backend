
const express = require("express");
const router = express.Router();
const { allocateCoins } = require("../services/walletService");

router.post("/allocate", (req, res) => {
  try {
    const { parentId, childId, amount } = req.body;
    const result = allocateCoins(parentId, childId, amount);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
