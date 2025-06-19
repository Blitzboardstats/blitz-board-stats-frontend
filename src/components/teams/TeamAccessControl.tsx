
import React from 'react';
import BottomNav from '@/components/BottomNav';

interface TeamAccessControlProps {
  isLoading: boolean;
  team: any;
  hasTeamAccess: boolean;
  children: React.ReactNode;
}

const TeamAccessControl = ({ isLoading, team, hasTeamAccess, children }: TeamAccessControlProps) => {
  if (isLoading) {
    console.log('TeamAccessControl: Still loading team data');
    return (
      <div className="flex min-h-screen items-center justify-center bg-blitz-charcoal">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4"></div>
          <p className="text-white">Loading team details...</p>
        </div>
      </div>
    );
  }
  
  if (!team) {
    console.log('TeamAccessControl: No team found');
    return (
      <div className="p-4">
        <div className="my-8 text-center">
          <p className="text-gray-400 mb-4">The requested team could not be found.</p>
        </div>
        <BottomNav />
      </div>
    );
  }
  
  if (!hasTeamAccess) {
    console.log('TeamAccessControl: No team access');
    return (
      <div className="p-4">
        <div className="my-8 text-center">
          <p className="text-gray-400 mb-4">You don't have access to view this team.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return <>{children}</>;
};

export default TeamAccessControl;
