
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  football_type: string;
  age_group?: string;
  season?: string;
}

interface FindTeamsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FindTeamsDialog = ({ open, onOpenChange }: FindTeamsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerJerseyNumber, setPlayerJerseyNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitJoinRequest } = useTeamJoinRequests();

  const searchTeams = async () => {
    if (!searchTerm.trim()) {
      setTeams([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, football_type, age_group, season')
        .ilike('name', `%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error searching teams:', error);
      toast.error('Failed to search teams');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedTeam || !playerName.trim()) {
      toast.error('Please select a team and enter player name');
      return;
    }

    setIsSubmitting(true);
    const success = await submitJoinRequest(
      selectedTeam.id,
      playerName.trim(),
      playerJerseyNumber.trim() || undefined,
      message.trim() || undefined
    );

    if (success) {
      // Reset form
      setSelectedTeam(null);
      setPlayerName('');
      setPlayerJerseyNumber('');
      setMessage('');
      setSearchTerm('');
      setTeams([]);
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTeams();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-blitz-darkgray border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Find Teams for Your Player</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedTeam ? (
            <>
              {/* Search Section */}
              <div className="space-y-3">
                <Label className="text-white">Search for Teams</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Enter team name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-blitz-charcoal border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="text-center text-gray-400">
                  Searching teams...
                </div>
              )}

              {teams.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Search Results</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {teams.map((team) => (
                      <Card key={team.id} className="bg-blitz-charcoal border-gray-600 cursor-pointer hover:border-blitz-purple transition-colors"
                            onClick={() => setSelectedTeam(team)}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-white">{team.name}</h4>
                              <p className="text-sm text-gray-400">{team.football_type}</p>
                              {team.age_group && (
                                <p className="text-sm text-gray-400">Age Group: {team.age_group}</p>
                              )}
                              {team.season && (
                                <p className="text-sm text-gray-400">Season: {team.season}</p>
                              )}
                            </div>
                            <Button size="sm" className="bg-blitz-purple hover:bg-blitz-purple/90">
                              Select
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {searchTerm && !isSearching && teams.length === 0 && (
                <div className="text-center text-gray-400">
                  No teams found matching "{searchTerm}"
                </div>
              )}
            </>
          ) : (
            <>
              {/* Selected Team & Request Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Request to Join Team</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeam(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    Back to Search
                  </Button>
                </div>

                <Card className="bg-blitz-charcoal border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">{selectedTeam.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blitz-purple/20 text-blitz-purple">
                        {selectedTeam.football_type}
                      </Badge>
                      {selectedTeam.age_group && (
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                          {selectedTeam.age_group}
                        </Badge>
                      )}
                      {selectedTeam.season && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400">
                          {selectedTeam.season}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="playerName" className="text-white">Player Name *</Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your player's name"
                      className="bg-blitz-charcoal border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="playerJerseyNumber" className="text-white">Jersey Number (Optional)</Label>
                    <Input
                      id="playerJerseyNumber"
                      value={playerJerseyNumber}
                      onChange={(e) => setPlayerJerseyNumber(e.target.value)}
                      placeholder="Enter jersey number"
                      className="bg-blitz-charcoal border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white">Message to Coach (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add any additional information about your request..."
                      className="bg-blitz-charcoal border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting || !playerName.trim()}
                    className="w-full bg-blitz-green hover:bg-blitz-green/90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Submit Request</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindTeamsDialog;
