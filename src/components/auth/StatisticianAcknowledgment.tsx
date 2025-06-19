
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, Target, Users, AlertTriangle } from 'lucide-react';

interface StatisticianAcknowledgmentProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

const StatisticianAcknowledgment = ({ isOpen, onAccept, onClose }: StatisticianAcknowledgmentProps) => {
  const [accuracyAgreed, setAccuracyAgreed] = useState(false);
  const [fairnessAgreed, setFairnessAgreed] = useState(false);
  const [visibilityAgreed, setVisibilityAgreed] = useState(false);
  const [reportingAgreed, setReportingAgreed] = useState(false);

  const canProceed = accuracyAgreed && fairnessAgreed && visibilityAgreed && reportingAgreed;

  const handleAccept = () => {
    if (canProceed) {
      // Store acceptance in localStorage
      localStorage.setItem('blitz-statistician-terms-accepted', new Date().toISOString());
      onAccept();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-blitz-charcoal border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <BarChart3 className="text-blitz-purple" />
            📱 Statistician Responsibilities
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="bg-blue-900/20 border-blue-700">
            <Target className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              Before you start entering stats for your team, please read and agree to the following:
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Accuracy Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accuracy-agreement"
                checked={accuracyAgreed}
                onCheckedChange={(checked) => setAccuracyAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="accuracy-agreement" className="text-sm text-gray-300 cursor-pointer">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-white">
                    I understand that the accuracy of team stats relies on the data I enter.
                  </span>
                </div>
              </label>
            </div>

            {/* Fairness Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="fairness-agreement"
                checked={fairnessAgreed}
                onCheckedChange={(checked) => setFairnessAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="fairness-agreement" className="text-sm text-gray-300 cursor-pointer">
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  <span className="font-medium text-white">
                    I agree to track and record game actions fairly and accurately based on what happens on the field.
                  </span>
                </div>
              </label>
            </div>

            {/* Visibility Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="visibility-agreement"
                checked={visibilityAgreed}
                onCheckedChange={(checked) => setVisibilityAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="visibility-agreement" className="text-sm text-gray-300 cursor-pointer">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-orange-400 flex-shrink-0" />
                  <span className="font-medium text-white">
                    I acknowledge that this data represents all players on my team and may be viewed by coaches, parents, and league officials.
                  </span>
                </div>
              </label>
            </div>

            {/* Reporting Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="reporting-agreement"
                checked={reportingAgreed}
                onCheckedChange={(checked) => setReportingAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="reporting-agreement" className="text-sm text-gray-300 cursor-pointer">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                  <span className="font-medium text-white">
                    I will notify my coach or admin if I encounter issues or errors in data entry.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              By tapping "Accept & Enter Stats", you confirm your agreement to these terms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              disabled={!canProceed}
              className="flex-1 bg-blitz-purple hover:bg-blitz-purple/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept & Enter Stats
            </Button>
            {onClose && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticianAcknowledgment;
