
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Player } from '@/types/playerTypes';
import { TeamCoach, TeamMember } from '@/types/teamTypes';
import { usePermissions } from '@/hooks/usePermissions';
import TeamInfoHeader from './TeamInfoHeader';
import CoachManagerView from './CoachManagerView';
import ParentGuardianView from './ParentGuardianView';

interface SimplifiedTeamTabsProps {
  players: Player[];
  coaches: TeamCoach[];
  members: TeamMember[];
  teamId: string;
  teamName?: string;
  ageGroup?: string;
  onPlayerClick: (player: Player) => void;
  onCoachClick?: (coach: TeamCoach) => void;
  onRemoveCoach?: (coach: TeamCoach) => void;
  onEditCoach?: (coach: TeamCoach) => void;
  onRemoveMember?: (member: TeamMember) => void;
  onResendPlayerInvitation?: (player: Player) => void;
  onResendCoachInvitation?: (coach: TeamCoach) => void;
  canManageTeam?: boolean;
  playersLoading?: boolean;
  playersError?: string | null;
  onRetryPlayers?: () => void;
}

const SimplifiedTeamTabs = ({
  players,
  coaches,
  members,
  teamId,
  teamName,
  ageGroup,
  onPlayerClick,
  onCoachClick,
  onRemoveCoach,
  onEditCoach,
  onRemoveMember,
  onResendPlayerInvitation,
  onResendCoachInvitation,
  canManageTeam = false,
  playersLoading = false,
  playersError = null,
  onRetryPlayers
}: SimplifiedTeamTabsProps) => {
  const { permissions } = usePermissions(teamId);
  const location = useLocation();
  
  // Determine which view to show:
  // - If user can view all player stats (coach/member), show CoachManagerView
  // - If user is a guardian for any player on this team, show ParentGuardianView
  // - Otherwise, show CoachManagerView as fallback
  const isCoachOrManager = permissions.canViewAllPlayerStats;
  const isGuardian = permissions.isGuardianForAnyPlayer;
  
  console.log('SimplifiedTeamTabs: Debug info:', {
    isCoachOrManager,
    isGuardian,
    canViewAllPlayerStats: permissions.canViewAllPlayerStats,
    isGuardianForAnyPlayer: permissions.isGuardianForAnyPlayer,
    teamId,
    canManageTeam
  });
  
  // Get the active tab from navigation state or default based on user type
  const [activeTab, setActiveTab] = useState(() => {
    const state = location.state as { activeTab?: string } | null;
    if (state?.activeTab) {
      return state.activeTab;
    }
    // Default to appropriate tab based on user type
    if (isCoachOrManager) {
      return 'players';
    } else if (isGuardian) {
      return 'my-player';
    } else {
      return 'players';
    }
  });

  // Update active tab when location state changes
  useEffect(() => {
    const state = location.state as { activeTab?: string } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);

  // Update default tab when permissions change
  useEffect(() => {
    if (!location.state?.activeTab) {
      if (isCoachOrManager) {
        setActiveTab('roster');
      } else if (isGuardian) {
        setActiveTab('my-player');
      } else {
        setActiveTab('roster');
      }
    }
  }, [isCoachOrManager, isGuardian, location.state?.activeTab]);
  
  return (
    <div className="w-full">
      <TeamInfoHeader teamName={teamName} ageGroup={ageGroup} />

      {isCoachOrManager ? (
        <CoachManagerView
          players={players}
          coaches={coaches}
          members={members}
          teamId={teamId}
          teamName={teamName}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPlayerClick={onPlayerClick}
          onCoachClick={onCoachClick}
          onRemoveCoach={onRemoveCoach}
          onEditCoach={onEditCoach}
          onRemoveMember={onRemoveMember}
          onResendPlayerInvitation={onResendPlayerInvitation}
          onResendCoachInvitation={onResendCoachInvitation}
          canManageTeam={canManageTeam}
          playersLoading={playersLoading}
          playersError={playersError}
          onRetryPlayers={onRetryPlayers}
        />
      ) : (
        <ParentGuardianView
          players={players}
          coaches={coaches}
          members={members}
          teamId={teamId}
          teamName={teamName}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPlayerClick={onPlayerClick}
        />
      )}
    </div>
  );
};

export default SimplifiedTeamTabs;
