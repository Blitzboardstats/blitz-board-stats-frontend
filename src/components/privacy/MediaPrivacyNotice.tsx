
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Video, Share2, Shield, Users, Mail } from 'lucide-react';

const MediaPrivacyNotice: React.FC = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Camera className="h-5 w-5" />
          Media Consent & Privacy for Minors
        </CardTitle>
        <CardDescription className="text-blue-700">
          Understanding how we handle photos, videos, and social media content involving players under 18
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-white border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Parental Consent Required:</strong> We require verifiable parental or legal guardian consent 
            before any photos, videos, or social media content featuring a child under 18 is posted, shared, 
            or made publicly available through our Services.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Photos</h4>
            </div>
            <p className="text-sm text-blue-700">
              Team photos, action shots, and promotional images featuring your child
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Videos & Highlights</h4>
            </div>
            <p className="text-sm text-blue-700">
              Game highlights, training videos, and promotional content
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Social Media</h4>
            </div>
            <p className="text-sm text-blue-700">
              Sharing on team social accounts and public platforms
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Your Rights as a Parent/Guardian
          </h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• <strong>Opt In:</strong> Give consent for specific types of media sharing</li>
            <li>• <strong>Opt Out:</strong> Withdraw consent at any time</li>
            <li>• <strong>Content Removal:</strong> Request removal of existing content</li>
            <li>• <strong>Selective Permissions:</strong> Choose different settings for photos, videos, and social media</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Content Removal Process</h4>
          <p className="text-sm text-yellow-800 mb-2">
            To revoke consent or request content removal:
          </p>
          <ol className="space-y-1 text-sm text-yellow-800">
            <li>1. Update your consent preferences in the app settings</li>
            <li>2. Contact our support team at support@blitzboardstats.com</li>
            <li>3. We will promptly remove or restrict use of the relevant media where reasonably possible</li>
          </ol>
        </div>

        <div className="bg-gray-50 border rounded p-3">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> We do not knowingly publish or distribute images, videos, or related content 
            involving minors without appropriate consent and will take immediate action to address any concerns raised.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-blue-200">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Questions about media consent?
          </p>
          <a 
            href="mailto:support@blitzboardstats.com" 
            className="text-blitz-purple hover:text-blitz-purple/80 font-medium text-sm underline"
          >
            Contact Support
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaPrivacyNotice;
