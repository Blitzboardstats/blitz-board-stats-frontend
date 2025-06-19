/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Team } from "@/types/teamTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores";

interface TeamHeaderProps {
  team: Team;
  canManageTeam?: boolean;
  onTeamUpdate?: (updatedTeam: Partial<Team>) => void;
}

const TeamHeader = ({
  team,
  canManageTeam = false,
  onTeamUpdate,
}: TeamHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleGoBack = () => {
    navigate("/teams");
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `team-${team.id}-logo.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("team-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("team-logos")
        .getPublicUrl(fileName);

      // Update team with new logo URL
      const { data: teamData, error: updateError } = await supabase
        .from("teams")
        .update({ logo_url: urlData.publicUrl })
        .eq("id", team.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success("Team logo updated successfully");
      onTeamUpdate?.({ logo_url: urlData.publicUrl });
      setIsUploadDialogOpen(false);
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='mb-6'>
      <div className='flex items-center mb-4'>
        <Button variant='ghost' className='mr-2 p-2' onClick={handleGoBack}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <Header title={team.name}>
          <div className='text-sm text-black'>
            {team.footballType} • {team.ageGroup} • {team.season}
          </div>
        </Header>
      </div>

      {/* Team Logo Section */}
      <div className='flex items-center gap-4 mb-4'>
        <div className='relative'>
          <div className='w-20 h-20 rounded-full bg-blitz-darkgray border-2 border-gray-700 flex items-center justify-center overflow-hidden'>
            {team.logo_url ? (
              <img
                src={team.logo_url}
                alt={`${team.name} logo`}
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-2xl font-bold text-blitz-purple'>
                {team.name.charAt(0)}
              </span>
            )}
          </div>

          {canManageTeam && (
            <Button
              size='sm'
              className='absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blitz-purple hover:bg-blitz-purple/90 p-0'
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Camera className='h-4 w-4' />
            </Button>
          )}
        </div>

        <div>
          <h1 className='text-2xl font-bold'>{team.name}</h1>
          <p className='text-black'>
            {team.footballType} • {team.ageGroup} • {team.season}
          </p>
        </div>
      </div>

      {team.photo_url && (
        <div className='w-full overflow-hidden rounded-lg mb-4'>
          <img
            src={team.photo_url}
            alt={team.name}
            className='w-full h-48 object-cover'
          />
        </div>
      )}

      {/* Logo Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className='bg-blitz-darkgray border-gray-700 text-gray-100'>
          <DialogHeader>
            <DialogTitle>Upload Team Logo</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center justify-center'>
              <label className='cursor-pointer'>
                <div className='flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-blitz-purple transition-colors'>
                  <Upload className='w-8 h-8 text-gray-400' />
                  <span className='text-sm text-gray-400'>
                    {isUploading ? "Uploading..." : "Click to upload logo"}
                  </span>
                  <span className='text-xs text-gray-500'>
                    PNG, JPG, JPEG, WEBP up to 5MB
                  </span>
                </div>
                <input
                  type='file'
                  accept='image/png,image/jpeg,image/jpg,image/webp'
                  className='hidden'
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamHeader;
