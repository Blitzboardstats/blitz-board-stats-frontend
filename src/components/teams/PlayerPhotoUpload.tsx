
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface PlayerPhotoUploadProps {
  playerPhoto: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export const PlayerPhotoUpload = ({ playerPhoto, onPhotoChange }: PlayerPhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoChange(event.target.result as string);
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Player Photo</Label>
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24 rounded-full bg-blitz-darkgray overflow-hidden flex items-center justify-center border border-gray-700">
          {playerPhoto ? (
            <img
              src={playerPhoto}
              alt="Player photo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-8 h-8 text-gray-500" />
          )}
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin h-6 w-6 border-t-2 border-blitz-purple rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <label className="cursor-pointer">
          <span className="text-sm text-blitz-purple hover:underline">Upload photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};
