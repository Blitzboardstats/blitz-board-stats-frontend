
import React from 'react';
import { Player } from '@/types/playerTypes';
import { useGuardianPlayers } from '@/hooks/useGuardianPlayers';
import { MyPlayerCard } from './MyPlayerCard';
import { Heart, Users, Sparkles } from 'lucide-react';

interface MyPlayersViewProps {
  teamId: string;
  onPlayerClick: (player: Player) => void;
}

export const MyPlayersView = ({ teamId, onPlayerClick }: MyPlayersViewProps) => {
  const { guardianPlayers, isLoading } = useGuardianPlayers(teamId);

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

  if (guardianPlayers.length === 0) {
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
            You don't have any children registered on this team yet.
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            My {guardianPlayers.length === 1 ? 'Child' : 'Children'}
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-gray-300 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          {guardianPlayers.length} player{guardianPlayers.length !== 1 ? 's' : ''} on this team
        </p>
      </div>
      
      {/* Player Cards */}
      <div className="grid gap-8 max-w-4xl mx-auto">
        {guardianPlayers.map((player) => (
          <MyPlayerCard
            key={player.id}
            player={player}
            currentTeamId={teamId}
            onPlayerClick={onPlayerClick}
          />
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8">
        <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-purple-200 text-sm">
            ✨ This shows only your children on this team. Visit the <strong>Roster</strong> tab to see all team players and coaches.
          </p>
        </div>
      </div>
    </div>
  );
};
