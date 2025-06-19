import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import GuardianManagement from "@/components/profile/GuardianManagement";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores";

const Profile = () => {
  const { user, isLoading: loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-blitz-charcoal'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4'></div>
          <p className='text-white'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-blitz-charcoal'>
        <div className='text-center'>
          <p className='text-white mb-4'>No user data available</p>
          <Button
            onClick={() => navigate("/login")}
            className='bg-blitz-purple hover:bg-blitz-purple/80'
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-blitz-charcoal pb-20'>
      <div className='p-4'>
        <div className='flex items-center mb-6'>
          <Button
            variant='ghost'
            size='sm'
            className='mr-2 text-white hover:bg-gray-800'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </Button>
          <Header title='Profile' showLogo={false} />
        </div>

        <div className='max-w-md mx-auto space-y-6'>
          {isEditing ? (
            <ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />
          ) : (
            <ProfileInfo onEditProfile={() => setIsEditing(true)} />
          )}

          {user.role === "player" && <GuardianManagement />}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
