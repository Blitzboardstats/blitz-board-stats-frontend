import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/types/teamTypes";
import { Upload } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTeam: (team: Team) => void;
  userId: string;
}

const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  footballType: z.enum(["tackle", "flag"]),
  ageGroup: z.string().optional(),
  season: z.string().optional(),
});

const flagAgeGroups = ["10U", "12U", "14U", "14 Elite", "17U", "JV", "Varsity"];
const seasonOptions = [
  "Spring 2025",
  "Summer 2025",
  "Fall 2025",
  "Winter 2025",
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
  "Winter 2026",
];

const CreateTeamDialog = ({
  open,
  onOpenChange,
  onCreateTeam,
  userId,
}: CreateTeamDialogProps) => {
  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      footballType: "tackle",
      ageGroup: "",
      season: "",
    },
  });

  const [teamPhoto, setTeamPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);

      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setTeamPhoto(event.target.result as string);
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: z.infer<typeof teamSchema>) => {
    if (!values.name.trim()) {
      return;
    }

    const newTeam: Team = {
      name: values.name,
      footballType: values.footballType,
      ageGroup: values.ageGroup || "",
      season: values.season || `${new Date().getFullYear()}`,
      photo_url: teamPhoto || undefined,
    };

    onCreateTeam(newTeam);
    setTeamPhoto(null);
    form.reset();
  };

  const footballType = form.watch("footballType");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-blitz-charcoal text-white border-gray-800 sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Create New Team
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter team name'
                      className='input-field'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <Label>Team Photo</Label>
              <div className='flex items-center justify-center'>
                <div className='relative w-24 h-24 rounded-full bg-blitz-darkgray overflow-hidden flex items-center justify-center border border-gray-700'>
                  {teamPhoto ? (
                    <img
                      src={teamPhoto}
                      alt='Team logo preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <Upload className='w-8 h-8 text-gray-500' />
                  )}

                  {isUploading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                      <div className='animate-spin h-6 w-6 border-t-2 border-blitz-purple rounded-full'></div>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-center'>
                <label className='cursor-pointer'>
                  <span className='text-sm text-blitz-purple hover:underline'>
                    Upload photo
                  </span>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <FormField
              control={form.control}
              name='footballType'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormLabel>Football Type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type='single'
                      variant='outline'
                      className='justify-start bg-blitz-darkgray border border-gray-700 rounded-md p-1'
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value);
                          // Reset age group when football type changes
                          form.setValue("ageGroup", "");
                        }
                      }}
                    >
                      <ToggleGroupItem
                        value='tackle'
                        className='data-[state=on]:bg-blitz-purple data-[state=on]:text-white'
                      >
                        Tackle
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value='flag'
                        className='data-[state=on]:bg-blitz-purple data-[state=on]:text-white'
                      >
                        Flag
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ageGroup'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Group</FormLabel>
                  <FormControl>
                    {footballType === "flag" ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Select age group' />
                        </SelectTrigger>
                        <SelectContent className='bg-blitz-darkgray border-gray-700'>
                          {flagAgeGroups.map((ageGroup) => (
                            <SelectItem
                              key={ageGroup}
                              value={ageGroup}
                              className='text-gray-100'
                            >
                              {ageGroup}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder='U10, High School, etc.'
                        className='input-field'
                        {...field}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='season'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='input-field'>
                        <SelectValue placeholder='Select season' />
                      </SelectTrigger>
                      <SelectContent className='bg-blitz-darkgray border-gray-700'>
                        {seasonOptions.map((season) => (
                          <SelectItem
                            key={season}
                            value={season}
                            className='text-gray-100'
                          >
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='border-gray-600 text-gray-300'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-blitz-purple hover:bg-blitz-purple/90'
              >
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
