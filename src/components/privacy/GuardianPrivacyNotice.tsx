
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Eye, Lock } from 'lucide-react';
import PrivacyStatement from './PrivacyStatement';

const GuardianPrivacyNotice: React.FC = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Shield className="h-5 w-5" />
          Guardian Privacy & Access Rights
        </CardTitle>
        <CardDescription className="text-blue-700">
          Important information about your privacy and data protection as a guardian
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-white border-blue-200">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>As a guardian, you have been granted access to:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Your child's team roster and coaching staff information</li>
              <li>• Game schedules, practice times, and event updates</li>
              <li>• Your child's individual statistics and performance data</li>
              <li>• Team communications and announcements</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Data Transparency</h4>
            </div>
            <p className="text-sm text-blue-700">
              We only collect necessary information to provide team management services and protect your child's privacy.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Secure Access</h4>
            </div>
            <p className="text-sm text-blue-700">
              Your guardian access is limited to information related to your child's teams and activities only.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">COPPA Compliant</h4>
            </div>
            <p className="text-sm text-blue-700">
              We comply with children's privacy laws and require parental consent for minors under 13.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Your Rights as a Guardian</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Review and update your child's information at any time</li>
            <li>• Control your child's profile visibility settings</li>
            <li>• Opt out of media sharing for your child</li>
            <li>• Request deletion of your child's data</li>
            <li>• Withdraw consent and remove guardian access</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-blue-700">
            For complete details about our privacy practices:
          </p>
          <PrivacyStatement 
            isGuardianFocused={true}
            trigger={
              <button className="text-blitz-purple hover:text-blitz-purple/80 font-medium text-sm underline">
                View Full Privacy Policy
              </button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardianPrivacyNotice;
