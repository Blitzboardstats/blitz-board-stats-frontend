
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Video, Share2, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

interface MediaConsentManagerProps {
  playerAge?: number;
  isMinor?: boolean;
  initialConsents?: {
    photos: boolean;
    videos: boolean;
    socialMedia: boolean;
  };
  onConsentChange?: (consents: { photos: boolean; videos: boolean; socialMedia: boolean }) => void;
}

const MediaConsentManager: React.FC<MediaConsentManagerProps> = ({
  playerAge,
  isMinor = false,
  initialConsents = { photos: false, videos: false, socialMedia: false },
  onConsentChange
}) => {
  const [consents, setConsents] = useState(initialConsents);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConsentChange = async (type: 'photos' | 'videos' | 'socialMedia', value: boolean) => {
    const newConsents = { ...consents, [type]: value };
    setConsents(newConsents);
    
    setIsUpdating(true);
    try {
      await onConsentChange?.(newConsents);
      toast.success(`Media consent updated for ${type}`);
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Failed to update media consent');
      // Revert the change
      setConsents(consents);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-white border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Shield className="h-5 w-5" />
          Media Consent & Privacy Settings
        </CardTitle>
        <CardDescription className="text-blue-700">
          {isMinor ? 
            "Parental consent is required for sharing photos, videos, or social media content featuring this player" :
            "Manage your media sharing preferences"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isMinor && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Minor Protection:</strong> This player is under 18. All media consent decisions must be made by a parent or legal guardian.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Photos</h4>
                <p className="text-sm text-gray-600">
                  Allow photos featuring this player to be shared publicly, used in promotional materials, or posted on social media
                </p>
              </div>
            </div>
            <Switch
              checked={consents.photos}
              onCheckedChange={(value) => handleConsentChange('photos', value)}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Videos & Highlights</h4>
                <p className="text-sm text-gray-600">
                  Allow videos and game highlights featuring this player to be shared publicly or used for promotional purposes
                </p>
              </div>
            </div>
            <Switch
              checked={consents.videos}
              onCheckedChange={(value) => handleConsentChange('videos', value)}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Share2 className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Social Media Sharing</h4>
                <p className="text-sm text-gray-600">
                  Allow this player's content to be shared on official team social media accounts and public platforms
                </p>
              </div>
            </div>
            <Switch
              checked={consents.socialMedia}
              onCheckedChange={(value) => handleConsentChange('socialMedia', value)}
              disabled={isUpdating}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• These settings can be changed at any time</li>
            <li>• Consent can be withdrawn, and we will remove content where reasonably possible</li>
            <li>• Previously shared content may remain visible until removed</li>
            <li>• Contact support for immediate content removal requests</li>
          </ul>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Questions or Concerns?</strong> Contact us at support@blitzboardstats.com to modify these preferences or request content removal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaConsentManager;
