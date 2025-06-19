import React, { useState } from "react";
import { User } from "@/types/userTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

interface ProfileEditFormProps {
  user: User;
  onCancel: () => void;
}

const ProfileEditForm = ({ user, onCancel }: ProfileEditFormProps) => {
  const { user: updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || user.phoneNumber || "",
    jerseyNumber: user.jersey_number || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        jersey_number: +formData.jerseyNumber || undefined,
      });

      toast.success("Profile updated successfully!");
      onCancel();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='bg-blitz-charcoal border-gray-800'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-black'>
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Name
            </label>
            <Input
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='bg-blitz-darkgray border-gray-700 text-black'
              required
            />
          </div>

          {user.role === "player" && (
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>
                Jersey Number
              </label>
              <Input
                name='jerseyNumber'
                value={formData.jerseyNumber}
                onChange={handleInputChange}
                className='bg-blitz-darkgray border-gray-700 text-black'
                type='number'
                required
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Email
            </label>
            <Input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='bg-blitz-darkgray border-gray-700 text-black'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Phone Number
            </label>
            <Input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              className='bg-blitz-darkgray border-gray-700 text-black'
            />
          </div>

          <div className='flex space-x-3 pt-4'>
            <Button
              type='submit'
              className='flex-1 bg-blitz-purple hover:bg-blitz-purple/90'
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='flex-1 border-gray-700 text-white hover:bg-gray-800'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
