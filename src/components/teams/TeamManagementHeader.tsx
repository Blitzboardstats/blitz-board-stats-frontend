
import React from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { PlusCircle } from 'lucide-react';

interface TeamManagementHeaderProps {
  isCoach: boolean;
  isLoading: boolean;
  onCreateTeam: () => void;
}

const TeamManagementHeader = ({ isCoach, isLoading, onCreateTeam }: TeamManagementHeaderProps) => {
  return (
    <>
      <Header title="My Teams" />
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blitz-purple">My Teams</h2>
        {isCoach && (
          <Button 
            onClick={onCreateTeam}
            className="bg-blitz-purple hover:bg-blitz-purple/90"
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-blitz-purple" /> New Team
          </Button>
        )}
      </div>
    </>
  );
};

export default TeamManagementHeader;
