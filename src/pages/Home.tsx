
import React from 'react';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MessageSquare, UserRound, Trophy, UsersRound } from 'lucide-react';

const Home = () => {
  const { user, isCoach } = useAuth();
  const navigate = useNavigate();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      name: 'Schedule',
      description: 'View your upcoming practices and games',
      icon: <Calendar className="h-6 w-6 text-blitz-purple" />,
      action: () => navigate('/schedule'),
    },
    {
      name: 'Huddle',
      description: 'Team announcements and chat',
      icon: <MessageSquare className="h-6 w-6 text-blitz-purple" />,
      action: () => navigate('/huddle'),
    },
    {
      name: 'Roster',
      description: 'View team roster and player stats',
      icon: <Users className="h-6 w-6 text-blitz-purple" />,
      action: () => navigate('/roster'),
    }
  ];

  // Coach-specific actions
  const coachActions = [
    {
      name: 'Team Management',
      description: 'Manage your teams and players',
      icon: <UsersRound className="h-6 w-6 text-green-500" />,
      action: () => navigate('/teams'),
    }
  ];

  return (
    <div className="pb-20">
      <div className="p-4">
        <Header title="BlitzPro" />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{greeting()}, {user?.name?.split(' ')[0] || 'Coach'}</h1>
          <p className="text-gray-400">Welcome to BlitzPro</p>
        </div>

        {/* Coach-specific section, quick actions, and recent updates */}
        {isCoach && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Coach Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coachActions.map((action, index) => (
                <Card key={index} className="blitz-card cursor-pointer hover:border-blitz-purple/50 transition-colors" onClick={action.action}>
                  <CardContent className="p-4 flex items-start">
                    <div className="mr-4 mt-1">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.name}</h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="blitz-card cursor-pointer hover:border-blitz-purple/50 transition-colors" onClick={action.action}>
                <CardContent className="p-4 flex items-start">
                  <div className="mr-4 mt-1">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.name}</h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Recent Updates</h2>
          <Card className="blitz-card">
            <CardContent className="p-4">
              <p className="text-gray-400">No recent updates.</p>
            </CardContent>
            <CardFooter className="border-t border-gray-800 p-3 text-right">
              <Button variant="link" className="text-blitz-purple p-0">
                View all updates
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
