
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid } from "lucide-react";

interface PlayerSeasonStatsHeaderProps {
  viewMode: "grid" | "cards";
  onViewModeChange: (mode: "grid" | "cards") => void;
}

export const PlayerSeasonStatsHeader = ({
  viewMode,
  onViewModeChange,
}: PlayerSeasonStatsHeaderProps) => {
  return (
    <div className='flex justify-end'>
      <div className='flex bg-blitz-charcoal rounded-lg p-1'>
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size='sm'
          onClick={() => onViewModeChange("grid")}
          className={
            viewMode === "grid"
              ? "bg-blitz-purple"
              : "text-black hover:text-black"
          }
        >
          <LayoutGrid className='w-4 h-4 mr-2' />
          Grid View
        </Button>
        <Button
          variant={viewMode === "cards" ? "default" : "ghost"}
          size='sm'
          onClick={() => onViewModeChange("cards")}
          className={
            viewMode === "cards"
              ? "bg-blitz-purple"
              : "text-black hover:text-black"
          }
        >
          <Grid className='w-4 h-4 mr-2' />
          Card View
        </Button>
      </div>
    </div>
  );
};
