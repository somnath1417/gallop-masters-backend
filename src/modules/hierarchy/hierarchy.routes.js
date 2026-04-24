const router = require("express").Router();
const auth = require("../../middlewares/auth");
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./hierarchy.service");

router.use(auth);

router.get(
  "/allowed-roles",
  asyncHandler(async (req, res) =>
    res.json({
      success: true,
      data: await service.getAllowedRoles(req.user),
    }),
  ),
);

router.post(
  "/users",
  asyncHandler(async (req, res) =>
    res.status(201).json({
      success: true,
      data: await service.createChild(req.user, req.body),
    }),
  ),
);

router.get(
  "/tree",
  asyncHandler(async (req, res) =>
    res.json({ success: true, data: await service.getMyTree(req.user) }),
  ),
);

router.get(
  "/children",
  asyncHandler(async (req, res) =>
    res.json({
      success: true,
      data: await service.getDirectChildren(req.user),
    }),
  ),
);

module.exports = router;
