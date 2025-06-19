
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@/types/playerTypes';
import { useGuardianPlayersGrouped } from '@/hooks/useGuardianPlayersGrouped';
import { GroupedPlayerCard } from './GroupedPlayerCard';
import { Heart, Users, Sparkles, Globe } from 'lucide-react';

interface GroupedPlayersViewProps {
  onPlayerClick: (player: Player) => void;
}

export const GroupedPlayersView = ({ onPlayerClick }: GroupedPlayersViewProps) => {
  const { guardianPlayersGroup, isLoading, error } = useGuardianPlayersGrouped();
  const navigate = useNavigate();

  const handleTeamNavigate = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading your children...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-400/30">
            <Heart className="w-12 h-12 text-red-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Error Loading Players</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  if (!guardianPlayersGroup || guardianPlayersGroup.linked_players.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-purple-300/30">
            <Heart className="w-12 h-12 text-purple-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">No Children Found</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            You don't have any children registered yet.
          </p>
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong>Need to add your child?</strong><br />
              Please contact your team coach or administrator to add your child to the roster with your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalTeams = guardianPlayersGroup.linked_players.reduce((sum, player) => sum + player.teams.length, 0);
  const multiTeamPlayers = guardianPlayersGroup.linked_players.filter(player => player.teams.length > 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            My {guardianPlayersGroup.linked_players.length === 1 ? 'Child' : 'Children'}
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{guardianPlayersGroup.linked_players.length} player{guardianPlayersGroup.linked_players.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{totalTeams} team membership{totalTeams !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Multi-team notification */}
      {multiTeamPlayers.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
          <p className="text-blue-200 text-sm text-center">
            <Globe className="w-4 h-4 inline mr-2" />
            <strong>Unified View:</strong> {multiTeamPlayers.length} of your children are on multiple teams. 
            This view groups them together for easier management.
          </p>
        </div>
      )}
      
      {/* Grouped Player Cards */}
      <div className="grid gap-8 max-w-4xl mx-auto">
        {guardianPlayersGroup.linked_players.map((groupedPlayer) => (
          <GroupedPlayerCard
            key={`${groupedPlayer.player_name}_${groupedPlayer.age_group}`}
            groupedPlayer={groupedPlayer}
            onPlayerClick={onPlayerClick}
            onTeamNavigate={handleTeamNavigate}
          />
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8">
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm">
            ✨ This unified view shows all your children across all teams. Players on multiple teams are grouped together by name and age group.
          </p>
        </div>
      </div>
    </div>
  );
};
