
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Users, Mail, Phone, Camera, Video, Share2 } from 'lucide-react';

interface PrivacyStatementProps {
  trigger?: React.ReactNode;
  isGuardianFocused?: boolean;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

const PrivacyStatement: React.FC<PrivacyStatementProps> = ({ 
  trigger, 
  isGuardianFocused = false,
  onAccept,
  showAcceptButton = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = () => {
    onAccept?.();
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="link" className="text-blitz-purple hover:text-blitz-purple/80 p-0 h-auto">
      Privacy Policy
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-foreground">
            <Shield className="h-6 w-6 text-blitz-purple" />
            Blitz Board Stats Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isGuardianFocused 
              ? "Understanding how we protect your information as a guardian" 
              : "How we collect, use, and protect your personal information"
            }
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-foreground">
            
            {isGuardianFocused && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  For Parents & Guardians
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  When your child adds you as a guardian, you'll have access to their team information, schedules, 
                  and statistics. We are committed to protecting both your privacy and your child's information 
                  in accordance with applicable privacy laws, including COPPA.
                </p>
              </div>
            )}

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Overview</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                Please read this Privacy Policy carefully to understand how Blitz Board Stats ("we," "us," or "our") 
                collects, uses, shares, and protects your personal information when you access or use our Services, 
                including our mobile application and website.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By accessing, using, downloading, or interacting with our Services, you acknowledge that you have 
                read, understood, and agreed to the terms of this Privacy Policy.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Eye className="h-5 w-5" />
                Information We Collect
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Categories of Information Collected:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Identifiers:</strong> Player first and last names, jersey numbers, team affiliations, and profile photos (if uploaded)</li>
                    <li>• <strong>Parent/Guardian Contact Information:</strong> Names, email addresses, and phone numbers</li>
                    <li>• <strong>Protected Information:</strong> Age, date of birth</li>
                    <li>• <strong>Educational Information:</strong> School name, grade level</li>
                    <li>• <strong>User Login Credentials:</strong> For coaches, parents, and league administrators</li>
                    <li>• <strong>Device and Usage Data:</strong> Device identifiers, IP addresses, and app usage patterns</li>
                    <li>• <strong>Schedule and Event Location Data:</strong> Only if submitted as part of a team schedule</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> We do not collect precise geolocation data unless you choose to provide it. 
                    We do not sell or share personal information to third parties for commercial or marketing purposes.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Use of Information</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                We use personal information for:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Creation and management of player and team profiles</li>
                <li>• Game statistics tracking and display</li>
                <li>• Communications regarding schedules, game updates, and team activities</li>
                <li>• Maintenance of account security and fraud prevention</li>
                <li>• Internal analytics and app functionality improvements</li>
                <li>• Compliance with legal and regulatory obligations</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                <p className="text-sm text-green-800">
                  Player information is accessible only to authorized team coaches, team admins, and associated 
                  parents/guardians with appropriate access rights.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Camera className="h-5 w-5" />
                Media Consent for Minors (Photos, Videos, Social Media)
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Parental Consent Required
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Blitz Board Stats is committed to protecting the privacy and safety of minors. If a child under the age of 18 
                    is featured in photos, videos, or social media content, we require verifiable parental or legal guardian consent 
                    before any such content is posted, shared, or otherwise made publicly available through our Services.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <h5 className="font-medium text-foreground">Photos</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">Team photos, action shots, promotional images</p>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <h5 className="font-medium text-foreground">Videos</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">Game highlights, training videos, promotional content</p>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="h-4 w-4 text-blue-600" />
                      <h5 className="font-medium text-foreground">Social Media</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">Team social accounts, public platforms</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Opt-In/Opt-Out Rights</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Opt In:</strong> Parents or guardians may consent to allow the use of their child's image, name, or other identifying information for promotional, social media, or content-sharing purposes</li>
                    <li>• <strong>Opt Out:</strong> This consent can be withdrawn at any time by contacting us at support@blitzboardstats.com</li>
                    <li>• <strong>Content Removal:</strong> We will promptly remove or restrict the use of relevant media where reasonably possible</li>
                    <li>• <strong>No Unauthorized Distribution:</strong> We do not knowingly publish or distribute images, videos, or related content involving minors without appropriate consent</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Children's Privacy (COPPA Compliance)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Children Under 13</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Children under the age of 13 are not permitted to use our Services directly. Any personal 
                    information regarding a child under 13 must be submitted by a parent, legal guardian, or 
                    authorized adult.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Parental Controls and Privacy Choices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Parental Consent Required:</strong> We do not collect, share, or post any personal information about children under 18 without verified parental or guardian consent</li>
                    <li>• <strong>Profile Visibility Settings:</strong> Parents or guardians can choose whether a child's profile is public, visible only to teammates/coaches, or completely private</li>
                    <li>• <strong>Media Sharing Options:</strong> You can opt in or out of allowing your child's photos, videos, and highlights to be shared publicly</li>
                    <li>• <strong>Data Access and Deletion:</strong> You have the right to review, correct, or delete your child's personal information at any time</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5" />
                Communication Preferences
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                You have control over the types of communications you receive from us, including updates, 
                announcements, and promotional messages. You may update your preferences or unsubscribe at 
                any time through the app settings or by clicking the UNSUBSCRIBE link in our emails.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">California Consumer Privacy Rights (CCPA/CPRA)</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                California residents have the following rights:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• To know the categories and specific personal information we have collected about them</li>
                <li>• To request deletion of their personal information</li>
                <li>• To opt out of the sale or sharing of personal data (note: Blitz Board Stats does not sell personal information)</li>
                <li>• To request limitations on the use and disclosure of sensitive personal information</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Data Retention & Security</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We retain your Personal Information only as long as necessary to fulfill the purposes for which 
                it was collected, unless a longer retention period is required or permitted by law. When we no 
                longer have a business need to process your Personal Information, we will delete or anonymize it.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Us</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you have any questions or concerns about our privacy practices, including media consent, 
                please contact us at support@blitzboardstats.com. We are committed to addressing your inquiries 
                and resolving any privacy-related issues promptly.
              </p>
            </section>

            <div className="bg-gray-50 border rounded p-4 mt-6">
              <p className="text-xs text-gray-600">
                <strong>Last Updated:</strong> This Privacy Policy may be updated periodically. The most current 
                version is always available within the app. By continuing to use our Services after any changes 
                take effect, you agree to the updated terms.
              </p>
            </div>
          </div>
        </ScrollArea>

        {showAcceptButton && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccept} className="bg-blitz-purple hover:bg-blitz-purple/90">
              I Accept Privacy Policy
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyStatement;
