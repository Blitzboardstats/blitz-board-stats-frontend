
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface GuardianFormProps {
  guardianEmail: string;
  guardianName: string;
  onEmailChange: (email: string) => void;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const GuardianForm: React.FC<GuardianFormProps> = ({
  guardianEmail,
  guardianName,
  onEmailChange,
  onNameChange,
  onSubmit,
  isLoading
}) => {
  return (
    <Card className="bg-blitz-charcoal border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5" />
          Guardian Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add your parent or guardian's email so they can view your teams and stats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guardianEmail" className="text-gray-300">Guardian Email *</Label>
          <Input
            id="guardianEmail"
            type="email"
            value={guardianEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="guardian@example.com"
            disabled={isLoading}
            className="bg-blitz-darkgray border-gray-700 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guardianName" className="text-gray-300">Guardian Name (Optional)</Label>
          <Input
            id="guardianName"
            type="text"
            value={guardianName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Guardian's full name"
            disabled={isLoading}
            className="bg-blitz-darkgray border-gray-700 text-white"
          />
        </div>

        <Button 
          onClick={onSubmit}
          disabled={isLoading || !guardianEmail.trim()}
          className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
        >
          {isLoading ? 'Saving...' : 'Save Guardian Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GuardianForm;
