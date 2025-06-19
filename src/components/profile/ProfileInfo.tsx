import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

interface ProfileInfoProps {
  onEditProfile: () => void;
}

const ProfileInfo = ({ onEditProfile }: ProfileInfoProps) => {
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <div className='text-center'>
          <p className='text-gray-400'>No user data available</p>
        </div>
      </div>
    );
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className='bg-blitz-charcoal border-gray-800 text-black'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-xl font-semibold text-blitz-purple'>
          Profile Information
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          className='text-blitz-purple hover:text-blitz-green hover:bg-gray-800'
          onClick={onEditProfile}
        >
          <Edit size={16} className='mr-1' />
          Edit
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Profile Avatar and Basic Info */}
        <div className='flex items-center space-x-4'>
          <div className='h-16 w-16 rounded-full bg-blitz-purple flex items-center justify-center text-xl font-semibold text-white'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className='h-16 w-16 rounded-full object-cover'
              />
            ) : (
              getUserInitials(user.name)
            )}
          </div>
          <div>
            <h2 className='text-lg font-medium text-black'>{user.name}</h2>
            <p className='text-sm text-gray-400'>{formatRole(user.role)}</p>
            {user.team && (
              <p className='text-sm text-blitz-green'>{user.team}</p>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className='space-y-3 pt-4 border-t border-gray-700'>
          <div>
            <p className='text-sm text-gray-400 mb-1'>Email</p>
            <p className='text-black'>{user.email}</p>
          </div>

          {(user.phone || user.phoneNumber) && (
            <div>
              <p className='text-sm text-gray-400 mb-1'>Phone</p>
              <p className='text-black'>{user.phone || user.phoneNumber}</p>
            </div>
          )}

          <div>
            <p className='text-sm text-gray-400 mb-1'>Role</p>
            <p className='text-black'>{formatRole(user.role)}</p>
          </div>

          {user.team && (
            <div>
              <p className='text-sm text-gray-400 mb-1'>Team</p>
              <p className='text-black'>{user.team}</p>
            </div>
          )}
        </div>

        {/* Blitz Out Button */}
        <div className='pt-4 border-t border-gray-700'>
          <Button
            variant='outline'
            className='w-full bg-blue-900/20 text-blue-400 border-blue-900 hover:bg-blue-900/30 hover:text-blue-300'
            onClick={handleSignOut}
          >
            <LogOut size={16} className='mr-2' />
            Blitz Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
