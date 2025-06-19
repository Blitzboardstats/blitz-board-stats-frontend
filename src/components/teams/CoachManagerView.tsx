import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player } from "@/types/playerTypes";
import { TeamCoach, TeamMember } from "@/types/teamTypes";
import PlayerList from "./PlayerList";
import CoachesList from "./CoachesList";
import MembersList from "./MembersList";
import TeamScheduleTab from "./TeamScheduleTab";
import { PlayerSeasonStatsView } from "@/components/stats/PlayerSeasonStatsView";
import TeamCommunicationTab from "./TeamCommunicationTab";
import { PlayersLoadingState } from "./PlayersLoadingState";
import { useRosterPlayers } from "@/hooks/useRosterPlayers";

interface CoachManagerViewProps {
  players: Player[];
  coaches: TeamCoach[];
  members: TeamMember[];
  teamId: string;
  teamName?: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onPlayerClick: (player: Player) => void;
  onCoachClick?: (coach: TeamCoach) => void;
  onRemoveCoach?: (coach: TeamCoach) => void;
  onEditCoach?: (coach: TeamCoach) => void;
  onRemoveMember?: (member: TeamMember) => void;
  onRemovePlayer?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onResendPlayerInvitation?: (player: Player) => void;
  onResendCoachInvitation?: (coach: TeamCoach) => void;
  canManageTeam?: boolean;
  playersLoading?: boolean;
  playersError?: string | null;
  onRetryPlayers?: () => void;
}

const CoachManagerView = ({
  players: fallbackPlayers,
  coaches,
  members,
  teamId,
  teamName,
  activeTab,
  onTabChange,
  onPlayerClick,
  onCoachClick,
  onRemoveCoach,
  onEditCoach,
  onRemoveMember,
  onRemovePlayer,
  onEditPlayer,
  onResendPlayerInvitation,
  onResendCoachInvitation,
  canManageTeam = false,
  playersLoading: fallbackPlayersLoading = false,
  playersError: fallbackPlayersError = null,
  onRetryPlayers,
}: CoachManagerViewProps) => {
  // Determine which player data to use
  const isRosterTab = activeTab === "roster";
  const players = fallbackPlayers;
  const playersLoading = fallbackPlayersLoading;
  const playersError = fallbackPlayersError;
  const handleRetryPlayers = onRetryPlayers || (() => {});

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className='w-full'>
      <TabsList className='grid w-full grid-cols-4 bg-blitz-darkgray'>
        <TabsTrigger
          value='roster'
          className='data-[state=active]:bg-blitz-purple'
        >
          Roster
        </TabsTrigger>
        <TabsTrigger
          value='schedule'
          className='data-[state=active]:bg-blitz-purple'
        >
          Schedule
        </TabsTrigger>
        <TabsTrigger
          value='stats'
          className='data-[state=active]:bg-blitz-purple'
        >
          Season Stats
        </TabsTrigger>
        <TabsTrigger
          value='communication'
          className='data-[state=active]:bg-blitz-purple'
        >
          Huddle
        </TabsTrigger>
      </TabsList>

      <TabsContent value='roster' className='mt-4'>
        <div className='space-y-4'>
          <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold mb-3'>Team Players</h3>
            {playersLoading || playersError || players.length === 0 ? (
              <PlayersLoadingState
                isLoading={playersLoading}
                error={playersError}
                onRetry={handleRetryPlayers}
                playerCount={players.length}
              />
            ) : (
              <PlayerList
                players={players}
                onPlayerClick={onPlayerClick}
                canManageTeam={canManageTeam}
                onResendInvitation={onResendPlayerInvitation}
                onRemovePlayer={onRemovePlayer}
                onEditPlayer={onEditPlayer}
              />
            )}
          </div>
          <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold mb-3'>Coaching Staff</h3>
            <CoachesList
              coaches={coaches}
              players={players}
              canManageTeam={canManageTeam}
              onCoachClick={onCoachClick}
              onRemoveCoach={onRemoveCoach}
              onEditCoach={onEditCoach}
              onResendInvitation={onResendCoachInvitation}
            />
          </div>
          <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold mb-3'>Team Members</h3>
            <MembersList
              members={members}
              canManageTeam={canManageTeam}
              onRemoveMember={onRemoveMember}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value='schedule' className='mt-4'>
        <TeamScheduleTab teamId={teamId} canManageTeam={canManageTeam} />
      </TabsContent>

      <TabsContent value='stats' className='mt-4'>
        <PlayerSeasonStatsView teamId={teamId} />
      </TabsContent>

      <TabsContent value='communication' className='mt-4'>
        <TeamCommunicationTab
          teamId={teamId}
          teamName={teamName}
          canManageTeam={canManageTeam}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CoachManagerView;
