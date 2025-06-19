
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Target, Shield, Star } from "lucide-react";
import { PlayerSeasonStatsWithDetails } from "@/hooks/usePlayerSeasonStats";

interface PlayerSeasonStatsTableProps {
  playerStats: PlayerSeasonStatsWithDetails[];
  isAdmin: boolean;
  userEmail?: string;
}

export const PlayerSeasonStatsTable = ({
  playerStats,
  isAdmin,
  userEmail,
}: PlayerSeasonStatsTableProps) => {
  if (playerStats.length === 0) {
    return (
      <Card className='bg-blitz-darkgray border-gray-700'>
        <CardContent className='p-6 text-center'>
          <Trophy className='mx-auto h-12 w-12 text-gray-500 mb-4' />
          <h3 className='text-lg font-semibold text-black mb-2'>
            No Player Statistics Found
          </h3>
          <p className='text-black'>
            No season statistics have been uploaded for this team yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort players - user's children first if they're an admin/coach, then alphabetically
  const sortedStats = playerStats;

  return (
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-black flex items-center'>
          <Trophy className='w-6 h-6 mr-2 text-yellow-400' />
          {isAdmin ? "Team Season Statistics" : "My Player's Season Statistics"}
        </CardTitle>
        <p className='text-black text-sm'>
          Complete season statistics from uploaded game data
        </p>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-gray-600'>
                <TableHead className='text-black'>Jersey number</TableHead>
                <TableHead className='text-black'>Player</TableHead>
                <TableHead className='text-black text-center'>GP</TableHead>
                <TableHead className='text-black text-center'>
                  <div className='flex items-center justify-center'>
                    <Target className='w-4 h-4 mr-1 text-blue-400' />
                    QB Stats
                  </div>
                </TableHead>
                <TableHead className='text-black text-center'>
                  <div className='flex items-center justify-center'>
                    <Star className='w-4 h-4 mr-1 text-green-400' />
                    Offense
                  </div>
                </TableHead>
                <TableHead className='text-black text-center'>
                  <div className='flex items-center justify-center'>
                    <Shield className='w-4 h-4 mr-1 text-blitz-purple' />
                    Defense
                  </div>
                </TableHead>
                <TableHead className='text-black text-center'>
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((stat) => (
                <TableRow key={stat.id} className='border-gray-600'>
                  <TableCell className='text-start text-black'>
                    {stat.player.jersey_number || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <div className='flex items-center'>
                        <span className='font-medium text-black'>
                          {stat.player.name}
                        </span>
                        {userEmail === stat.player.guardian_email && (
                          <Badge className='bg-green-500/20 text-green-400 text-xs ml-2'>
                            Your Player
                          </Badge>
                        )}
                      </div>
                      {stat.player.guardian_email && (
                        <span className='text-xs text-black'>
                          Guardian: {stat.player.guardian_email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-center text-black'>
                    {stat.games_played}
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='text-xs space-y-1'>
                      <div className='text-black'>
                        {stat.qb_completions} comp, {stat.qb_touchdowns} TD
                      </div>
                      <div className='text-black'>
                        {stat.qb_td_points} pts
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='text-xs space-y-1'>
                      <div className='text-black'>
                        {stat.runs} runs, {stat.receptions} rec
                      </div>
                      <div className='text-black'>
                        {stat.player_td_points} pts,{" "}
                        {stat.extra_point_1 + stat.extra_point_2} XP
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='text-xs space-y-1'>
                      <div className='text-black'>
                        {stat.def_interceptions} INT, {stat.flag_pulls} pulls
                      </div>
                      <div className='text-black'>
                        {stat.pick_6} pick-6, {stat.safeties} safety
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge className='bg-blitz-purple/20 text-blitz-purple font-bold'>
                      {stat.total_points}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
