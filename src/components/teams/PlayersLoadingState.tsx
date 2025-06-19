
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Users } from "lucide-react";

interface PlayersLoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  playerCount?: number;
}

export const PlayersLoadingState = ({
  isLoading,
  error,
  onRetry,
  playerCount = 0,
}: PlayersLoadingStateProps) => {
  if (isLoading) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6 text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-blitz-purple animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Loading Players...
          </h3>
          <p className="text-gray-400">
            Please wait while we fetch the team roster.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-blitz-darkgray border-red-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to Load Players
          </h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (playerCount === 0) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6 text-center">
          <Users className="mx-auto h-8 w-8 text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No Players Found
          </h3>
          <p className="text-gray-400">
            This team doesn't have any players yet. Add some players to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
