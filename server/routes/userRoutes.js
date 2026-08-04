const express = require("express");
const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/:id", getProfile);
router.put("/:id", authMiddleware, upload.single("avatar"), updateProfile);
router.post("/:id/follow", authMiddleware, followUser);
router.delete("/:id/follow", authMiddleware, unfollowUser);

module.exports = router;