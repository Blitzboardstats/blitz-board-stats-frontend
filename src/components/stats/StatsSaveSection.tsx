
import React from 'react';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';

interface StatsSaveSectionProps {
  hasSessionStats: boolean;
  canEdit: boolean;
  isSaving: boolean;
  onSaveStats: () => Promise<void>;
}

export const StatsSaveSection = ({
  hasSessionStats,
  canEdit,
  isSaving,
  onSaveStats
}: StatsSaveSectionProps) => {
  if (!hasSessionStats || !canEdit) return null;

  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg p-3'>
      <Button
        onClick={onSaveStats}
        disabled={isSaving}
        variant='outline'
        size='sm'
        className='w-full mb-2'
      >
        <Save size={16} className='mr-2' />
        {isSaving ? "Saving Stats..." : "Save Session Stats"}
      </Button>
    </div>
  );
};
