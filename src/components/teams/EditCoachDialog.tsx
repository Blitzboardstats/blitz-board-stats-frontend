
import React, { useState, useEffect } from 'react';
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
import { TeamCoach } from '@/types/teamTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

interface EditCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: TeamCoach | null;
  onEditCoach: (coachId: string, updatedCoachData: Partial<TeamCoach>) => Promise<boolean>;
  onRemoveCoach?: (coachId: string) => Promise<boolean>;
}

const COACH_ROLES = [
  'Head Coach',
  'Assistant Coach',
  'Statistician',
  'Team Manager'
] as const;

const EditCoachDialog = ({
  open,
  onOpenChange,
  coach,
  onEditCoach,
  onRemoveCoach
}: EditCoachDialogProps) => {
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');
  const [coachRole, setCoachRole] = useState<typeof COACH_ROLES[number]>('Assistant Coach');
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (coach) {
      setCoachName(coach.name);
      setCoachEmail(coach.email || '');
      setCoachPhone(coach.phone || '');
      setCoachRole(coach.role);
    }
  }, [coach]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    
    setIsLoading(true);
    
    try {
      const updatedCoachData: Partial<TeamCoach> = {
        name: coachName,
        email: coachEmail || null,
        phone: coachPhone || null,
        role: coachRole
      };
      
      const success = await onEditCoach(coach.id, updatedCoachData);
      
      if (success) {
        onOpenChange(false);
        toast.success('Coach updated successfully');
      }
    } catch (error) {
      console.error('Error updating coach:', error);
      toast.error('Failed to update coach');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!coach || !onRemoveCoach) return;
    
    setIsRemoving(true);
    
    try {
      const success = await onRemoveCoach(coach.id);
      
      if (success) {
        onOpenChange(false);
        toast.success(`${coach.name} has been removed from the team`);
      }
    } catch (error) {
      console.error('Error removing coach:', error);
      toast.error('Failed to remove coach');
    } finally {
      setIsRemoving(false);
    }
  };

  if (!coach) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Coach</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the coach details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-white">Name</Label>
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
              <Label htmlFor="email" className="text-white">Email (optional)</Label>
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
              <Label htmlFor="phone" className="text-white">Phone (optional)</Label>
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
          
          <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row">
            {onRemoveCoach && (
              <Button 
                type="button"
                variant="destructive"
                onClick={handleRemove}
                disabled={isRemoving || isLoading}
                className="w-full sm:w-auto"
              >
                {isRemoving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Removing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Coach</span>
                  </div>
                )}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading || isRemoving}
              className="w-full sm:w-auto bg-blitz-purple hover:bg-blitz-purple/90 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Updating...</span>
                </div>
              ) : 'Update Coach'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCoachDialog;
