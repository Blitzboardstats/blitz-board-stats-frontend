
import React from 'react';
import { Button } from '../ui/button';
import { Square } from 'lucide-react';

interface EndGameButtonProps {
  isSaving: boolean;
  onEndGame: () => Promise<void>;
}

export const EndGameButton = ({
  isSaving,
  onEndGame
}: EndGameButtonProps) => {
  return (
    <Button
      onClick={onEndGame}
      variant='destructive'
      size='lg'
      disabled={isSaving}
    >
      <Square size={20} className='mr-2' />
      {isSaving ? "Saving..." : "End Game"}
    </Button>
  );
};
