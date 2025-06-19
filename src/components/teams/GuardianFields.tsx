
import React, { useEffect, useState } from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Camera } from 'lucide-react';
import { useTeamDetails } from '@/hooks/useTeamDetails';
import { useParams } from 'react-router-dom';
import PrivacyStatement from '@/components/privacy/PrivacyStatement';

interface GuardianFieldsProps {
  control: Control<any>;
  originalGuardianEmail: string;
}

export const GuardianFields = ({ control, originalGuardianEmail }: GuardianFieldsProps) => {
  const { teamId } = useParams<{ teamId: string }>();
  const { coaches } = useTeamDetails(teamId);
  const [isCoachGuardian, setIsCoachGuardian] = useState(false);
  const [matchingCoach, setMatchingCoach] = useState<string | null>(null);

  // Watch the guardian email field to check for coach matches
  const watchGuardianEmail = (email: string) => {
    if (!email || !coaches) {
      setIsCoachGuardian(false);
      setMatchingCoach(null);
      return;
    }

    const coach = coaches.find(c => c.email?.toLowerCase() === email.toLowerCase());
    if (coach) {
      setIsCoachGuardian(true);
      setMatchingCoach(coach.name);
    } else {
      setIsCoachGuardian(false);
      setMatchingCoach(null);
    }
  };

  return (
    <>
      <div className="border-t border-gray-800 my-4 pt-2">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Parent/Guardian Information</h3>
      </div>

      <Alert className="bg-blue-900/20 border-blue-700 mb-4">
        <Shield className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200 text-sm">
          Guardian information is protected according to our privacy policy. Guardians will only have access 
          to information related to this player's teams and activities.{' '}
          <PrivacyStatement 
            isGuardianFocused={true}
            trigger={
              <button className="text-blue-400 hover:text-blue-300 underline font-medium">
                Learn more
              </button>
            }
          />
        </AlertDescription>
      </Alert>

      <Alert className="bg-yellow-900/20 border-yellow-700 mb-4">
        <Camera className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-200 text-sm">
          <strong>Media Consent:</strong> For players under 18, guardians control photo, video, and social media 
          sharing permissions. These settings can be managed after the guardian account is created.
        </AlertDescription>
      </Alert>
      
      <FormField
        control={control}
        name="guardian_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent/Guardian Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter parent/guardian name"
                className="input-field bg-blitz-gray text-white border-gray-700"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="guardian_email"
        render={({ field }) => {
          // Check for coach match whenever the email changes
          useEffect(() => {
            watchGuardianEmail(field.value);
          }, [field.value]);

          return (
            <FormItem>
              <FormLabel>Parent/Guardian Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email address"
                  className="input-field bg-blitz-gray text-white border-gray-700"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              
              {/* Show coach guardian indicator */}
              {isCoachGuardian && matchingCoach && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-blitz-purple/20 border-blitz-purple text-blitz-purple">
                    🏈 Coach & Guardian
                  </Badge>
                  <span className="text-sm text-gray-300">
                    {matchingCoach} is both a coach and guardian
                  </span>
                </div>
              )}
              
              {originalGuardianEmail && field.value && field.value !== originalGuardianEmail && (
                <p className="text-sm text-blue-400 mt-2">
                  📧 A welcome email with privacy information will be sent to the new email address when saved
                </p>
              )}
            </FormItem>
          );
        }}
      />
    </>
  );
};
