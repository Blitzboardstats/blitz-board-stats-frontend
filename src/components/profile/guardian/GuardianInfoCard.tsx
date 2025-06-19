
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Shield, Users, Mail, Camera } from 'lucide-react';
import PrivacyStatement from '@/components/privacy/PrivacyStatement';
import GuardianPrivacyNotice from '@/components/privacy/GuardianPrivacyNotice';
import MediaPrivacyNotice from '@/components/privacy/MediaPrivacyNotice';

const GuardianInfoCard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-blitz-charcoal border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Info className="h-5 w-5" />
            How Guardian Relationships Work
          </CardTitle>
          <CardDescription className="text-gray-400">
            Understanding the guardian system and privacy protections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-900/20 border-blue-700">
            <Shield className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Privacy First:</strong> When you add a guardian, they receive access only to information 
              related to your teams and activities. We comply with children's privacy laws and protect your data.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-white">What guardians can access:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>Team rosters and coaching staff information</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>Game schedules, practice times, and team communications</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>Your individual statistics and performance data</span>
              </li>
              <li className="flex items-start gap-2">
                <Camera className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>Media consent settings (photos, videos, social media)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="font-medium text-white mb-2">Important Notes:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Guardians can only see information for teams you're associated with</li>
              <li>• If your guardian doesn't have an account, they'll be invited to create one</li>
              <li>• You can remove guardian access at any time</li>
              <li>• All data is protected according to our privacy policy</li>
              <li>• Guardians control media consent for players under 18</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-sm text-gray-400">Learn about our privacy practices:</span>
            <PrivacyStatement 
              isGuardianFocused={true}
              trigger={
                <button className="text-blitz-purple hover:text-blitz-purple/80 font-medium text-sm underline">
                  Privacy Policy
                </button>
              }
            />
          </div>
        </CardContent>
      </Card>

      <GuardianPrivacyNotice />
      <MediaPrivacyNotice />
    </div>
  );
};

export default GuardianInfoCard;
