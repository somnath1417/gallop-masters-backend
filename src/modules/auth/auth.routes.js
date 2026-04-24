const router = require("express").Router();
const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");
router.post(
  "/login",
  asyncHandler(async (req, res) =>
    res.json({ success: true, data: await authService.login(req.body) }),
  ),
);
module.exports = router;
