
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { useUserTeamsQuery } from '@/hooks/useUserTeamsQuery';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Users } from 'lucide-react';

const Schedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: teams = [], isLoading } = useUserTeamsQuery();

  // If user has only one team, redirect to that team's schedule
  useEffect(() => {
    if (!isLoading && teams.length === 1) {
      navigate(`/team/${teams[0].id}`, { state: { activeTab: 'schedule' } });
    }
  }, [teams, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">Team Schedules</h1>
          <p className="text-gray-400 text-sm">View schedules for your teams</p>
        </div>
        
        {teams.length === 0 && (
          <Card className="bg-blitz-darkgray border border-gray-800">
            <CardContent className="p-8 text-center">
              <Users size={64} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No teams found</h3>
              <p className="text-gray-400 mb-6">You're not a member of any teams yet.</p>
              <Button 
                onClick={() => navigate('/teams')}
                className="bg-blitz-purple hover:bg-blitz-purple/90 text-white"
              >
                Browse Teams
              </Button>
            </CardContent>
          </Card>
        )}
        
        {teams.length > 1 && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm mb-4">
              Select a team to view its schedule:
            </p>
            {teams.map((team) => (
              <Card 
                key={team.id} 
                className="bg-blitz-darkgray border border-gray-800 cursor-pointer hover:border-blitz-purple/50 transition-colors"
                onClick={() => navigate(`/team/${team.id}`, { state: { activeTab: 'schedule' } })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blitz-purple rounded-full flex items-center justify-center">
                        {team.logo_url ? (
                          <img 
                            src={team.logo_url} 
                            alt={`${team.name} logo`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Users size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{team.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{team.football_type}</span>
                          {team.age_group && (
                            <>
                              <span>•</span>
                              <span>{team.age_group}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CalendarIcon size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Schedule;
