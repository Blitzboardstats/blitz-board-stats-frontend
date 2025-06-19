
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const PlayerSeasonStatsLoadingState = () => {
  return (
    <Card className='bg-blitz-darkgray border-gray-700'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple'></div>
          <span className='ml-2 text-black'>
            Loading player statistics...
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
