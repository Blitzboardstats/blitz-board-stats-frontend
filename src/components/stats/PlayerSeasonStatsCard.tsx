
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Star, Shield } from "lucide-react";
import { PlayerSeasonStatsWithDetails } from "@/hooks/usePlayerSeasonStats";

interface PlayerSeasonStatsCardProps {
  player: PlayerSeasonStatsWithDetails;
  userEmail?: string;
}

export const PlayerSeasonStatsCard = ({
  player,
  userEmail,
}: PlayerSeasonStatsCardProps) => {
  return (
    <Card key={player.id} className='bg-blitz-darkgray border-gray-700'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg flex items-center justify-between'>
          <span className="text-black">
            #{" "}
            {player.player.jersey_number &&
              player.player.jersey_number}{" "}
            {player.player.name}
          </span>
          <Badge className='bg-blitz-purple/20 text-blitz-purple'>
            {player.total_points} pts
          </Badge>
        </CardTitle>
        <div className='text-sm text-black'>
          <p>
            {player.season} Season • {player.games_played} games played
          </p>
          {player.player.guardian_name && (
            <p>Guardian: {player.player.guardian_name}</p>
          )}
          {userEmail === player.player.guardian_email && (
            <Badge className='bg-green-500/20 text-green-400 text-xs mt-1'>
              Your Player
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Quarterback Stats */}
        {(player.qb_completions > 0 || player.qb_touchdowns > 0) && (
          <div>
            <h4 className='font-medium text-blue-400 mb-2 flex items-center'>
              <Target className='w-4 h-4 mr-2' />
              Quarterback Stats
            </h4>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-black'>Completions:</span>
                <span className='text-black'>
                  {player.qb_completions}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-black'>QB TDs:</span>
                <span className='text-black'>
                  {player.qb_touchdowns}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-black'>QB TD Points:</span>
                <span className='text-black'>
                  {player.qb_td_points}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Offensive Stats */}
        <div>
          <h4 className='font-medium text-green-400 mb-2 flex items-center'>
            <Star className='w-4 h-4 mr-2' />
            Offensive Stats
          </h4>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-black'>Runs:</span>
              <span className='text-black'>{player.runs}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'>Receptions:</span>
              <span className='text-black'>{player.receptions}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'>Player TD Points:</span>
              <span className='text-black'>
                {player.player_td_points}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'>Extra Point 1:</span>
              <span className='text-black'>{player.extra_point_1}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-black'>Extra Point 2:</span>
              <span className='text-black'>{player.extra_point_2}</span>
            </div>
          </div>
        </div>

        {/* Defensive Stats */}
        {(player.def_interceptions > 0 ||
          player.pick_6 > 0 ||
          player.safeties > 0 ||
          player.flag_pulls > 0) && (
          <div>
            <h4 className='font-medium text-blitz-purple mb-2 flex items-center'>
              <Shield className='w-4 h-4 mr-2' />
              Defensive Stats
            </h4>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-black'>Interceptions:</span>
                <span className='text-black'>
                  {player.def_interceptions}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-black'>Pick 6:</span>
                <span className='text-black'>{player.pick_6}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-black'>Safeties:</span>
                <span className='text-black'>{player.safeties}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-black'>Flag Pulls:</span>
                <span className='text-black'>
                  {player.flag_pulls}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Season Summary */}
        <div className='pt-2 border-t border-gray-600'>
          <div className='grid grid-cols-2 gap-4 text-center'>
            <div>
              <div className='text-xl font-bold text-black'>
                {player.total_points}
              </div>
              <div className='text-xs text-black'>
                Total Points
              </div>
            </div>
            <div>
              <div className='text-xl font-bold text-black'>
                {player.games_played}
              </div>
              <div className='text-xs text-black'>
                Games Played
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
