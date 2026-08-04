import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

export default function ProfileCard({ profile, isOwnProfile, isFollowing, onCountChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
      <img
        src={profile.avatarUrl || "https://placehold.co/100x100?text=Avatar"}
        alt={profile.name}
        className="w-24 h-24 rounded-full object-cover border"
      />
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-gray-500 text-sm">@{profile.username}</p>
        {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
        <div className="flex gap-4 mt-3 text-sm text-gray-600">
          <span><strong>{profile.followersCount}</strong> Followers</span>
          <span><strong>{profile.followingCount}</strong> Following</span>
        </div>
      </div>
      <div>
        {isOwnProfile ? (
          <Link
            to={`/profile/${profile.id}/edit`}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Edit Profile
          </Link>
        ) : (
          <FollowButton
            targetUserId={profile.id}
            initialIsFollowing={isFollowing}
            onCountChange={onCountChange}
          />
        )}
      </div>
    </div>
  );
}