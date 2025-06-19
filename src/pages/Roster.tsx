
import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { samplePlayers } from '@/data/sampleData';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, Shield } from 'lucide-react';

// Mock admin status - in a real app, this would come from an auth system
const isAdmin = true; // For demonstration purposes

const Roster = () => {
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  
  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setShowPlayerDetails(true);
  };
  
  const handleClaimProfile = () => {
    toast.success("Request sent to claim this player's profile");
    setShowPlayerDetails(false);
  };
  
  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center mt-8 p-6 bg-blitz-darkgray/30 rounded-lg text-center">
      <AlertCircle className="w-12 h-12 text-blitz-purple mb-4" />
      <h3 className="text-xl font-semibold mb-2">Not seeing your player?</h3>
      <p className="text-gray-400 mb-4">
        Players need to be added to the roster by a team admin or coach first.
      </p>
      <Button 
        variant="outline" 
        className="border-blitz-purple text-blitz-purple hover:bg-blitz-purple/10"
      >
        Request Player Addition
      </Button>
    </div>
  );
  
  if (!isAdmin) {
    return (
      <div className="pb-20 p-4">
        <Header title="Roster" />
        <div className="flex flex-col items-center justify-center py-8">
          <Shield className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-center text-gray-400 mb-6">
            Only coaches and team admins can view the full roster.
          </p>
          <EmptyState />
        </div>
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="p-4">
        <Header title="Roster">
          <div className="flex items-center text-sm text-blitz-purple gap-1 mt-1">
            <Shield size={14} />
            <span>Admin view</span>
          </div>
        </Header>
        
        {samplePlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {samplePlayers.map((player) => (
              <Card 
                key={player.id} 
                className="blitz-card cursor-pointer hover:border-blitz-purple/50 transition-colors"
                onClick={() => handlePlayerClick(player)}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blitz-darkgray rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-blitz-purple">{player.jerseyNumber}</span>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{player.nickname}</div>
                    <div className="text-sm text-gray-400">{player.position}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      
      {/* Player Details Dialog */}
      <Dialog open={showPlayerDetails} onOpenChange={setShowPlayerDetails}>
        <DialogContent className="bg-blitz-charcoal text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Player Profile</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-blitz-darkgray rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-blitz-purple">{selectedPlayer?.jerseyNumber}</span>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-semibold">{selectedPlayer?.nickname}</div>
              <div className="text-sm text-gray-400">{selectedPlayer?.position}</div>
            </div>
            
            <div className="w-full bg-blitz-darkgray/70 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Season Stats</h4>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <div className="text-gray-400">Games Played</div>
                  <div className="font-semibold">{selectedPlayer?.stats?.gamesPlayed}</div>
                </div>
                
                <div>
                  <div className="text-gray-400">Touchdowns</div>
                  <div className="font-semibold">{selectedPlayer?.stats?.touchdowns}</div>
                </div>
                
                <div>
                  <div className="text-gray-400">Tackles</div>
                  <div className="font-semibold">{selectedPlayer?.stats?.tackles}</div>
                </div>
                
                <div>
                  <div className="text-gray-400">Catches</div>
                  <div className="font-semibold">{selectedPlayer?.stats?.catches}</div>
                </div>
                
                <div>
                  <div className="text-gray-400">Yards</div>
                  <div className="font-semibold">{selectedPlayer?.stats?.yards}</div>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
              onClick={handleClaimProfile}
            >
              Claim Profile
            </Button>
            
            <div className="text-xs text-gray-400">
              This profile only shows public stats and info approved by parents/guardians.
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default Roster;
