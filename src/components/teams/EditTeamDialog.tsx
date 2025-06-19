
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Team } from '@/types/teamTypes';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onEditTeam: (teamId: string, updatedTeamData: Partial<Team>) => Promise<boolean>;
}

type FormValues = {
  name: string;
  football_type: 'Tackle' | 'Flag';
  age_group: string;
  season: string;
};

const flagAgeGroups = ['10U', '12U', '14U', '14 Elite', '17U', 'JV', 'Varsity'];
const seasonOptions = [
  'Spring 2025',
  'Summer 2025', 
  'Fall 2025',
  'Winter 2025',
  'Spring 2026',
  'Summer 2026',
  'Fall 2026',
  'Winter 2026'
];

const EditTeamDialog = ({
  open,
  onOpenChange,
  team,
  onEditTeam
}: EditTeamDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: team?.name || '',
      football_type: team?.football_type || 'Flag',
      age_group: team?.age_group || '',
      season: team?.season || ''
    },
  });
  
  React.useEffect(() => {
    if (team && open) {
      form.reset({
        name: team.name,
        football_type: team.football_type,
        age_group: team.age_group || '',
        season: team.season || ''
      });
    }
  }, [team, open, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!team) return;
    
    setIsSubmitting(true);
    try {
      const success = await onEditTeam(team.id, {
        name: values.name,
        football_type: values.football_type,
        age_group: values.age_group || null,
        season: values.season || null
      });
      
      if (success) {
        toast.success("Team updated successfully");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to update team");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footballType = form.watch('football_type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-darkgray border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Edit Team Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your team's information below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Team Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-gray-100" 
                      placeholder="Team Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="football_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Football Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Flag" className="text-gray-100">Flag</SelectItem>
                      <SelectItem value="Tackle" className="text-gray-100">Tackle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Age Group</FormLabel>
                  <FormControl>
                    {footballType === 'Flag' ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {flagAgeGroups.map((ageGroup) => (
                            <SelectItem key={ageGroup} value={ageGroup} className="text-gray-100">
                              {ageGroup}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-gray-100" 
                        placeholder="e.g., U10, U12"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Season</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {seasonOptions.map((season) => (
                          <SelectItem key={season} value={season} className="text-gray-100">
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blitz-purple hover:bg-blitz-purple/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
