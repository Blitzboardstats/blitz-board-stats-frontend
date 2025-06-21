import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Player } from "@/types/playerTypes";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: Player) => void;
  teamId: string;
}

const playerSchema = z.object({
  name: z.string().min(2, "Player name is required"),
  position: z.string().optional(),
  jersey_number: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  graduation_year: z.string().optional(),
  recruit_profile: z.string().optional(),
});

const AddPlayerDialog = ({
  open,
  onOpenChange,
  onAddPlayer,
  teamId,
}: AddPlayerDialogProps) => {
  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      position: "",
      jersey_number: "",
      guardian_name: "",
      guardian_email: "",
      graduation_year: "",
      recruit_profile: "",
    },
  });

  const [playerPhoto, setPlayerPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);

      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setPlayerPhoto(event.target.result as string);
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: z.infer<typeof playerSchema>) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      teamId,
      name: values.name,
      position: values.position,
      jerseyNumber: values.jersey_number,
      guardianName: values.guardian_name,
      guardianEmail: values.guardian_email,
      graduationYear: values.graduation_year
        ? parseInt(values.graduation_year)
        : undefined,
      recruitProfile: values.recruit_profile,
      photoUrl: playerPhoto || undefined,
      createdAt: new Date(),
    };

    onAddPlayer(newPlayer);
    setPlayerPhoto(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-blitz-charcoal text-white border-gray-800 sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Add Player
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
                  <FormLabel>Player Name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter player name'
                      className='input-field'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <Label>Player Photo</Label>
              <div className='flex items-center justify-center'>
                <div className='relative w-24 h-24 rounded-full bg-blitz-darkgray overflow-hidden flex items-center justify-center border border-gray-700'>
                  {playerPhoto ? (
                    <img
                      src={playerPhoto}
                      alt='Player photo preview'
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

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='QB, WR, etc.'
                        className='input-field'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='jersey_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jersey #</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='12'
                        className='input-field'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='graduation_year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of High School Graduation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='2025'
                      type='number'
                      min='2020'
                      max='2035'
                      className='input-field'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='recruit_profile'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruit Profile</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='What makes your player special!'
                      className='input-field min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='border-t border-gray-800 my-4 pt-2'>
              <h3 className='text-sm font-medium text-gray-400 mb-2'>
                Parent/Guardian Information
              </h3>
            </div>

            <FormField
              control={form.control}
              name='guardian_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter parent/guardian name'
                      className='input-field'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='guardian_email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter email address'
                      className='input-field'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                Add Player
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerDialog;
