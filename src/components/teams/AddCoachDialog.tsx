
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamCoach } from '@/types/teamTypes';

interface AddCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCoach: (coach: TeamCoach) => Promise<boolean>;
  teamId: string;
}

const COACH_ROLES = [
  'Head Coach',
  'Assistant Coach',
  'Statistician',
  'Team Manager'
] as const;

const AddCoachDialog = ({
  open,
  onOpenChange,
  onAddCoach,
  teamId
}: AddCoachDialogProps) => {
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');
  const [coachRole, setCoachRole] = useState<typeof COACH_ROLES[number]>('Assistant Coach');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coachName.trim()) {
      toast.error('Coach name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the coach record
      const newCoach: TeamCoach = {
        id: '',  // Will be set by Supabase
        team_id: teamId,
        name: coachName,
        email: coachEmail,
        phone: coachPhone,
        role: coachRole,
        created_at: new Date().toISOString()
      };
      
      const success = await onAddCoach(newCoach);
      
      if (success) {
        toast.success(`Coach ${coachName} added successfully`);
        
        // Reset form
        setCoachName('');
        setCoachEmail('');
        setCoachPhone('');
        setCoachRole('Assistant Coach');
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding coach:', error);
      toast.error('Failed to add coach');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Coach</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill out the details below to add a coach to the team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-white">Name *</Label>
              <Input
                id="name"
                placeholder="Enter coach name"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                required
                className="bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter coach email"
                value={coachEmail}
                onChange={(e) => setCoachEmail(e.target.value)}
                className="bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter coach phone"
                value={coachPhone}
                onChange={(e) => setCoachPhone(e.target.value)}
                className="bg-blitz-darkgray text-white border-gray-700 placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="role" className="text-white">Role</Label>
              <Select value={coachRole} onValueChange={(value) => setCoachRole(value as typeof COACH_ROLES[number])}>
                <SelectTrigger className="bg-blitz-darkgray text-white border-gray-700">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-blitz-darkgray text-white border-gray-700">
                  {COACH_ROLES.map(role => (
                    <SelectItem key={role} value={role} className="text-white hover:bg-blitz-gray">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !coachName.trim()}
              className="w-full bg-blitz-purple hover:bg-blitz-purple/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Adding Coach...</span>
                </div>
              ) : 'Add Coach'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoachDialog;
