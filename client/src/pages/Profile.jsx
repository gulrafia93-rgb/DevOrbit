import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/userService";
import ProfileCard from "../components/ProfileCard";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    getProfile(id)
      .then(setProfile)
      .catch(() => setError("Could not load this profile"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!profile) return null;

  const isOwnProfile = user?.id === profile.id;
  // We don't yet know the viewer's follow status from GET /users/:id (not returned by API.md),
  // so default to false — this is refined once the Feed/posts work ties everything together on Day 6.
  const isFollowing = false;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <ProfileCard
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onCountChange={(count) => setProfile((p) => ({ ...p, followingCount: count }))}
      />
      <div className="mt-6 text-gray-500 text-center">
        Posts will appear here starting Day 6.
      </div>
    </div>
  );
}