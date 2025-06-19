
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PlayerBasicFieldsProps {
  control: Control<any>;
}

export const PlayerBasicFields = ({ control }: PlayerBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Player Name*</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter player name"
                className="input-field bg-blitz-gray text-white border-gray-700"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input
                  placeholder="QB, WR, etc."
                  className="input-field bg-blitz-gray text-white border-gray-700"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="jersey_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jersey #</FormLabel>
              <FormControl>
                <Input
                  placeholder="12"
                  className="input-field bg-blitz-gray text-white border-gray-700"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="graduation_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year of High School Graduation</FormLabel>
            <FormControl>
              <Input
                placeholder="2025"
                type="number"
                min="2020"
                max="2035"
                className="input-field bg-blitz-gray text-white border-gray-700"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="recruit_profile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recruit Profile</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What makes your player special!"
                className="input-field bg-blitz-gray text-white border-gray-700 min-h-[80px]"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
