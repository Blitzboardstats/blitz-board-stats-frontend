import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Trophy, Users, Target, Play, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { TeamStatsView } from "@/components/stats/TeamStatsView";
import { PlayerStatsView } from "@/components/stats/PlayerStatsView";
import { LeaderboardsView } from "@/components/stats/LeaderboardsView";
import { LiveGamePlayByPlay } from "@/components/stats/LiveGamePlayByPlay";
import QuarterAnalyticsDashboard from "@/components/stats/QuarterAnalyticsDashboard";
import StatisticianAcknowledgment from "@/components/auth/StatisticianAcknowledgment";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useStatisticianAcknowledgment } from "@/hooks/useStatisticianAcknowledgment";

const Stats = () => {
  const { isCoach, user } = useAuth();
  const { hasAcceptedStatisticianTerms, isLoading: termsLoading, acceptStatisticianTerms } = useStatisticianAcknowledgment();
  const [showStatisticianDialog, setShowStatisticianDialog] = useState(false);

  // Check if user can edit live stats (Head Coach, Assistant Coach, Manager, or Statistician)
  const canEditLiveStats = isCoach || user?.role === 'statistician';
  const isStatistician = user?.role === 'statistician';

  // Check if we need to show statistician acknowledgment
  React.useEffect(() => {
    if (!termsLoading && isStatistician && hasAcceptedStatisticianTerms === false) {
      setShowStatisticianDialog(true);
    }
  }, [termsLoading, isStatistician, hasAcceptedStatisticianTerms]);

  const handleStatisticianAccept = () => {
    acceptStatisticianTerms();
    setShowStatisticianDialog(false);
  };

  // Mock quarter analytics data - in real implementation, this would come from the database
  const mockQuarterStats = [];

  const handleOptimizeRoster = (recommendations: any[]) => {
    console.log("Roster optimization recommendations:", recommendations);
    // In real implementation, this would update the team's roster or save recommendations
  };

  return (
    <div className='pb-20'>
      <div className='p-4'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-xl md:text-2xl font-bold mb-2 flex items-center space-x-2'>
            <BarChart3 className='text-blitz-purple' size={28} />
            <span>📈 Flag Football Stats & Analytics</span>
          </h1>
          <p className='text-black text-sm md:text-base'>
            Comprehensive team and player statistics with quarter-by-quarter
            analytics
          </p>
        </div>

        {/* Stats Tabs */}
        <Tabs defaultValue='team' className='space-y-6'>
          <div className='overflow-x-auto'>
            <TabsList className='grid w-max min-w-full grid-cols-5 bg-blitz-darkgray'>
              <TabsTrigger
                value='team'
                className='flex items-center justify-center space-x-1 md:space-x-2 data-[state=active]:bg-blitz-purple px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap'
              >
                <Users size={14} className='md:size-4' />
                <span className='hidden sm:inline'>Team Stats</span>
                <span className='sm:hidden'>Team</span>
              </TabsTrigger>
              <TabsTrigger
                value='players'
                className='flex items-center justify-center space-x-1 md:space-x-2 data-[state=active]:bg-blitz-purple px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap'
              >
                <Target size={14} className='md:size-4' />
                <span className='hidden sm:inline'>Live Stats</span>
                <span className='sm:hidden'>Live</span>
              </TabsTrigger>
              <TabsTrigger
                value='leaderboards'
                className='flex items-center justify-center space-x-1 md:space-x-2 data-[state=active]:bg-blitz-purple px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap'
              >
                <Trophy size={14} className='md:size-4' />
                <span className='hidden sm:inline'>Leaderboards</span>
                <span className='sm:hidden'>Leaders</span>
              </TabsTrigger>
              <TabsTrigger
                value='live-game'
                className='flex items-center justify-center space-x-1 md:space-x-2 data-[state=active]:bg-blitz-purple px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap'
              >
                <Play size={14} className='md:size-4' />
                <span className='hidden sm:inline'>Live Game</span>
                <span className='sm:hidden'>Live</span>
              </TabsTrigger>
              <TabsTrigger
                value='quarter-analytics'
                className='flex items-center justify-center space-x-1 md:space-x-2 data-[state=active]:bg-blitz-purple px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap'
              >
                <Clock size={14} className='md:size-4' />
                <span className='hidden sm:inline'>Quarter Analytics</span>
                <span className='sm:hidden'>Quarters</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='team'>
            <TeamStatsView />
          </TabsContent>

          <TabsContent value='players'>
            <PlayerStatsView />
          </TabsContent>

          <TabsContent value='leaderboards'>
            <LeaderboardsView />
          </TabsContent>

          <TabsContent value='live-game'>
            <LiveGamePlayByPlay canEdit={canEditLiveStats} />
          </TabsContent>

          <TabsContent value='quarter-analytics'>
            <QuarterAnalyticsDashboard
              teamId='mock-team-id'
              gameStats={mockQuarterStats}
              onOptimizeRoster={handleOptimizeRoster}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />

      {/* Statistician Acknowledgment Dialog */}
      {showStatisticianDialog && (
        <StatisticianAcknowledgment
          isOpen={showStatisticianDialog}
          onAccept={handleStatisticianAccept}
          onClose={() => setShowStatisticianDialog(false)}
        />
      )}
    </div>
  );
};

export default Stats;
