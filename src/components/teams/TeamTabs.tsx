
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Player, TeamCoach, TeamMember } from '@/types/teamTypes';
import PlayerList from './PlayerList';
import CoachesList from './CoachesList';
import MembersList from './MembersList';

interface TeamTabsProps {
  players: Player[];
  coaches: TeamCoach[];
  members: TeamMember[];
  teamId: string;
  onPlayerClick: (player: Player) => void;
  onCoachClick?: (coach: TeamCoach) => void;
  onRemoveCoach?: (coach: TeamCoach) => void;
  onEditCoach?: (coach: TeamCoach) => void;
  onRemoveMember?: (member: TeamMember) => void;
  onResendPlayerInvitation?: (player: Player) => void;
  onResendCoachInvitation?: (coach: TeamCoach) => void;
  canManageTeam: boolean;
}

const TeamTabs = ({
  players,
  coaches,
  members,
  teamId,
  onPlayerClick,
  onCoachClick,
  onRemoveCoach,
  onEditCoach,
  onRemoveMember,
  onResendPlayerInvitation,
  onResendCoachInvitation,
  canManageTeam
}: TeamTabsProps) => {
  return (
    <Tabs defaultValue="players" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="players">
          Players ({players.length})
        </TabsTrigger>
        <TabsTrigger value="coaches">
          Coaches ({coaches.length})
        </TabsTrigger>
        <TabsTrigger value="members">
          Members ({members.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="players" className="mt-4">
        <PlayerList
          players={players}
          onPlayerClick={onPlayerClick}
          onResendInvitation={onResendPlayerInvitation}
          canManageTeam={canManageTeam}
        />
      </TabsContent>
      
      <TabsContent value="coaches" className="mt-4">
        <CoachesList
          coaches={coaches}
          onCoachClick={onCoachClick}
          onRemoveCoach={onRemoveCoach}
          onEditCoach={onEditCoach}
          onResendInvitation={onResendCoachInvitation}
          canManageTeam={canManageTeam}
        />
      </TabsContent>
      
      <TabsContent value="members" className="mt-4">
        <MembersList
          members={members}
          onRemoveMember={onRemoveMember}
          canManageTeam={canManageTeam}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TeamTabs;
