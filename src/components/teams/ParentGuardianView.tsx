import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player } from "@/types/playerTypes";
import { TeamCoach, TeamMember } from "@/types/teamTypes";
import PlayerList from "./PlayerList";
import CoachesList from "./CoachesList";
import TeamScheduleTab from "./TeamScheduleTab";
import { PlayerSeasonStatsView } from "@/components/stats/PlayerSeasonStatsView";
import TeamCommunicationTab from "./TeamCommunicationTab";
import GuardianTeamRequests from "./GuardianTeamRequests";
import { GroupedPlayersView } from "./GroupedPlayersView";
import GuardianRelationshipTab from "./GuardianRelationshipTab";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useAuthStore } from "@/stores";

interface ParentGuardianViewProps {
  players: Player[];
  coaches: TeamCoach[];
  members: TeamMember[];
  teamId: string;
  teamName?: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onPlayerClick: (player: Player) => void;
  onRemovePlayer?: (player: Player) => void;
  onEditPlayer?: (player: Player) => void;
  onResendInvitation?: (player: Player) => void;
}

const ParentGuardianView = ({
  players,
  coaches,
  members,
  teamId,
  teamName,
  activeTab,
  onTabChange,
  onPlayerClick,
  onRemovePlayer,
  onEditPlayer,
  onResendInvitation,
}: ParentGuardianViewProps) => {
  const { user } = useAuthStore();

  const isPlayer = user?.role === "player";

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className='w-full'>
      <TabsList
        className={`grid w-full ${
          isPlayer ? "grid-cols-6" : "grid-cols-5"
        } bg-blitz-darkgray`}
      >
        <TabsTrigger
          value='my-player'
          className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
        >
          My Children
        </TabsTrigger>
        <TabsTrigger
          value='schedule'
          className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
        >
          Schedule
        </TabsTrigger>
        <TabsTrigger
          value='roster'
          className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
        >
          Roster
        </TabsTrigger>
        <TabsTrigger
          value='stats'
          className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
        >
          Season Stats
        </TabsTrigger>
        <TabsTrigger
          value='communication'
          className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
        >
          Huddle
        </TabsTrigger>
        {isPlayer && (
          <TabsTrigger
            value='guardian'
            className='data-[state=active]:bg-blitz-purple text-xs sm:text-sm text-white'
          >
            Guardian
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value='my-player' className='mt-4'>
        <GroupedPlayersView onPlayerClick={onPlayerClick} />
      </TabsContent>

      <TabsContent value='schedule' className='mt-4'>
        <TeamScheduleTab teamId={teamId} canManageTeam={false} />
      </TabsContent>

      <TabsContent value='roster' className='mt-4'>
        <div className='space-y-4'>
          <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold mb-3 text-white'>
              Team Players
            </h3>
            <PlayerList
              players={players}
              onPlayerClick={onPlayerClick}
              canManageTeam={false}
              onResendInvitation={onResendInvitation}
              onRemovePlayer={onRemovePlayer}
              onEditPlayer={onEditPlayer}
            />
          </div>
          <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
            <h3 className='text-lg font-semibold mb-3 text-white'>
              Coaching Staff
            </h3>
            <CoachesList
              coaches={coaches}
              players={players}
              canManageTeam={false}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value='stats' className='mt-4'>
        <div className='bg-blitz-darkgray border border-gray-700 rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-3 text-white'>
            Season Statistics
          </h3>
          <PlayerSeasonStatsView teamId={teamId} />
        </div>
      </TabsContent>

      <TabsContent value='communication' className='mt-4'>
        <TeamCommunicationTab
          teamId={teamId}
          teamName={teamName}
          canManageTeam={false}
        />
      </TabsContent>

      {isPlayer && (
        <TabsContent value='guardian' className='mt-4'>
          <GuardianRelationshipTab />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ParentGuardianView;
