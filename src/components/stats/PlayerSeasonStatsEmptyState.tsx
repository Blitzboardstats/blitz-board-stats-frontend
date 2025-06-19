
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface PlayerSeasonStatsEmptyStateProps {
  isAdmin: boolean;
  canViewAllPlayerStats: boolean;
  userEmail?: string;
}

export const PlayerSeasonStatsEmptyState = ({
  isAdmin,
  canViewAllPlayerStats,
  userEmail,
}: PlayerSeasonStatsEmptyStateProps) => {
  return (
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardContent className='p-6 text-center'>
        <Trophy className='mx-auto h-12 w-12 text-gray-500 mb-4' />
        <h3 className='text-lg font-semibold text-black mb-2'>
          No Player Statistics Found
        </h3>
        <p className='text-black mb-4'>
          {isAdmin || canViewAllPlayerStats
            ? "No season statistics have been uploaded for this team yet."
            : "No season statistics found for players where you are listed as the guardian."}
        </p>
        <p className='text-sm text-black'>
          Season statistics are typically imported by team coaches and
          managers.
        </p>
        {!isAdmin && !canViewAllPlayerStats && (
          <div className='mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg'>
            <p className='text-blue-300 text-sm'>
              <strong>Parent/Guardian Access:</strong> You can only view
              statistics for players where your email ({userEmail}) matches
              the guardian email on file.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
