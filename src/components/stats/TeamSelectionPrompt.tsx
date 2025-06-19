
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamSelectionPromptProps {
  shouldShow: boolean;
}

export const TeamSelectionPrompt = ({ shouldShow }: TeamSelectionPromptProps) => {
  if (!shouldShow) return null;

  return (
    <Card className='bg-green-500/10 border-green-500/30'>
      <CardContent className='p-4 text-center'>
        <p className='text-black text-sm'>
          Please select a team above to start live game tracking
        </p>
      </CardContent>
    </Card>
  );
};
