import { useState } from "react";
import { followUser, unfollowUser } from "../services/userService";

export default function FollowButton({ targetUserId, initialIsFollowing, onCountChange }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = isFollowing
        ? await unfollowUser(targetUserId)
        : await followUser(targetUserId);
      setIsFollowing(data.isFollowing);
      if (onCountChange) onCountChange(data.followingCount);
    } catch (err) {
      console.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 rounded-md text-sm font-medium ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}