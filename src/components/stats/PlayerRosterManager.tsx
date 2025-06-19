
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, ArrowRight, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
  isActive: boolean;
}

interface PlayerRosterManagerProps {
  canEdit: boolean;
  onActivePlayersChange: (activePlayers: Player[]) => void;
}

export const PlayerRosterManager = ({ canEdit, onActivePlayersChange }: PlayerRosterManagerProps) => {
  // Mock team roster - in real implementation, this would come from the database
  const [teamRoster] = useState<Player[]>([
    { id: '1', number: '12', name: 'John Smith', position: 'QB', isActive: true },
    { id: '2', number: '84', name: 'Mike Johnson', position: 'WR', isActive: true },
    { id: '3', number: '25', name: 'Tom Wilson', position: 'RB', isActive: true },
    { id: '4', number: '50', name: 'Alex Brown', position: 'LB', isActive: true },
    { id: '5', number: '4', name: 'Chris Davis', position: 'S', isActive: true },
    { id: '6', number: '88', name: 'Ryan Miller', position: 'WR', isActive: false },
    { id: '7', number: '22', name: 'Steve Clark', position: 'CB', isActive: false },
    { id: '8', number: '77', name: 'Mark Taylor', position: 'OL', isActive: false },
    { id: '9', number: '33', name: 'Dan White', position: 'RB', isActive: false },
    { id: '10', number: '91', name: 'Joe Garcia', position: 'DL', isActive: false },
  ]);

  const [activePlayers, setActivePlayers] = useState<Player[]>(
    teamRoster.filter(player => player.isActive)
  );
  const [benchPlayers, setBenchPlayers] = useState<Player[]>(
    teamRoster.filter(player => !player.isActive)
  );

  const movePlayerToActive = (player: Player) => {
    if (!canEdit) return;
    
    setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
    const updatedActivePlayers = [...activePlayers, { ...player, isActive: true }];
    setActivePlayers(updatedActivePlayers);
    onActivePlayersChange(updatedActivePlayers);
  };

  const movePlayerToBench = (player: Player) => {
    if (!canEdit) return;
    
    setActivePlayers(prev => prev.filter(p => p.id !== player.id));
    setBenchPlayers(prev => [...prev, { ...player, isActive: false }]);
    onActivePlayersChange(activePlayers.filter(p => p.id !== player.id));
  };

  const PlayerCard = ({ player, isActive, onMove }: { 
    player: Player; 
    isActive: boolean; 
    onMove: () => void; 
  }) => (
    <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3 border border-gray-600">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {player.number}
        </div>
        <div>
          <div className="text-white font-medium">{player.name}</div>
          <div className="text-gray-400 text-sm">{player.position}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Badge variant={isActive ? "default" : "outline"} className="text-xs">
          {isActive ? "Active" : "Bench"}
        </Badge>
        {canEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={onMove}
            className="h-8 w-8 p-0"
          >
            {isActive ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Active Players */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <UserCheck className="text-green-500" size={20} />
            <span>Active Players ({activePlayers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {activePlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={true}
              onMove={() => movePlayerToBench(player)}
            />
          ))}
          {activePlayers.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              <Users size={32} className="mx-auto mb-2 opacity-50" />
              <p>No active players</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bench Players */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <UserX className="text-gray-500" size={20} />
            <span>Bench ({benchPlayers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-80 overflow-y-auto">
          {benchPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={false}
              onMove={() => movePlayerToActive(player)}
            />
          ))}
          {benchPlayers.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              <Users size={32} className="mx-auto mb-2 opacity-50" />
              <p>All players active</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
