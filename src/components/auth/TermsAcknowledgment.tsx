
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, FileText, UserCheck } from 'lucide-react';
import PrivacyStatement from '@/components/privacy/PrivacyStatement';

interface TermsAcknowledgmentProps {
  isOpen: boolean;
  onAccept: () => void;
  userRole?: string;
}

const TermsAcknowledgment = ({ isOpen, onAccept, userRole }: TermsAcknowledgmentProps) => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [coachConsent, setCoachConsent] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);
  const [purposeAgreed, setPurposeAgreed] = useState(false);

  const isCoachOrAdmin = userRole === 'coach' || userRole === 'admin';
  const isParent = userRole === 'parent';

  const canProceed = privacyAccepted && 
    purposeAgreed && 
    (!isCoachOrAdmin || coachConsent) && 
    (!isParent || parentConsent);

  const handleAccept = () => {
    if (canProceed) {
      // Store acceptance in localStorage
      localStorage.setItem('blitz-terms-accepted', new Date().toISOString());
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-blitz-charcoal border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            📱 Welcome to Blitz Board Stats!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="bg-blue-900/20 border-blue-700">
            <Shield className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              Before using this app, you must read and agree to the following terms and conditions.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Privacy Policy and Terms Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy-terms"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-1"
              />
              <label htmlFor="privacy-terms" className="text-sm text-gray-300 cursor-pointer">
                <span className="font-medium text-white">I have read and agree to the Privacy Policy and Terms of Use.</span>
              </label>
            </div>

            {/* Coach/Admin Specific Consent */}
            {isCoachOrAdmin && (
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="coach-consent"
                  checked={coachConsent}
                  onCheckedChange={(checked) => setCoachConsent(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="coach-consent" className="text-sm text-gray-300 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-orange-400 flex-shrink-0" />
                    <span className="font-medium text-white">
                      If I am a coach/team admin, I agree to obtain parental consent before entering any player under age 13 into the system.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Parent/Guardian Specific Consent */}
            {isParent && (
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="parent-consent"
                  checked={parentConsent}
                  onCheckedChange={(checked) => setParentConsent(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="parent-consent" className="text-sm text-gray-300 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
                    <span className="font-medium text-white">
                      If I am a parent/guardian, I agree to manage my child's profile responsibly and can review, update, or request deletion of their information at any time.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Purpose Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="purpose-agreement"
                checked={purposeAgreed}
                onCheckedChange={(checked) => setPurposeAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="purpose-agreement" className="text-sm text-gray-300 cursor-pointer">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-blitz-purple flex-shrink-0" />
                  <span className="font-medium text-white">
                    I understand Blitz Board Stats is intended for team management and youth sports communication only and will not be used for any other purpose.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              By tapping "Accept & Continue", you confirm your agreement to these terms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              disabled={!canProceed}
              className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept & Continue
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-700">
            <PrivacyStatement 
              trigger={
                <button className="text-blitz-purple hover:text-blitz-purple/80 font-medium text-sm underline">
                  View Privacy Policy
                </button>
              }
            />
            <button 
              onClick={() => window.open('#', '_blank')}
              className="text-blitz-purple hover:text-blitz-purple/80 font-medium text-sm underline"
            >
              View Terms of Use
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAcknowledgment;
