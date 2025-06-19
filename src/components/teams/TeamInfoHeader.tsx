
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TeamInfoHeaderProps {
  teamName?: string;
  ageGroup?: string;
}

const TeamInfoHeader = ({ teamName, ageGroup }: TeamInfoHeaderProps) => {
  if (!teamName && !ageGroup) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-blitz-charcoal rounded-lg">
      <div className="flex items-center gap-3 flex-wrap">
        {teamName && (
          <h2 className="text-xl font-semibold">{teamName}</h2>
        )}
        {ageGroup && (
          <Badge variant="ageGroup" className="text-base font-medium px-3 py-1">
            {ageGroup} Division
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TeamInfoHeader;
