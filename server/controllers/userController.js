const User = require("../models/User");
const uploadToCloudinary = require("../services/cloudinaryUpload");

// GET /api/users/:id
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      // postsCount will be added on Day 6, once the Post model exists
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
const updateProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own profile" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, bio } = req.body;

    if (name !== undefined) {
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: "Name must be 2-50 characters" });
      }
      user.name = name;
    }

    if (bio !== undefined) {
      if (bio.length > 160) {
        return res.status(400).json({ message: "Bio must be under 160 characters" });
      }
      user.bio = bio;
    }

    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer, "devorbit/avatars");
      user.avatarUrl = avatarUrl;
    }

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/:id/follow
const followUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.user.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user.id);

    if (currentUser.following.includes(targetId)) {
      return res.status(409).json({ message: "You are already following this user" });
    }

    currentUser.following.push(targetId);
    targetUser.followers.push(req.user.id);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ followingCount: currentUser.following.length, isFollowing: true });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id/follow
const unfollowUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user.id);

    currentUser.following = currentUser.following.filter((id) => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== req.user.id);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ followingCount: currentUser.following.length, isFollowing: false });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, followUser, unfollowUser };