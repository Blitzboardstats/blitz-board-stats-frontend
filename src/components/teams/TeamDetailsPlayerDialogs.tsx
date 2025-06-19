import React from "react";
import { Player } from "@/types/playerTypes";
import AddPlayerDialog from "./AddPlayerDialog";
import EditPlayerDialog from "./EditPlayerDialog";
import RemovePlayerDialog from "./RemovePlayerDialog";
import PlayerDetailsDialog from "./PlayerDetailsDialog";

interface TeamDetailsPlayerDialogsProps {
  isAddPlayerOpen: boolean;
  setIsAddPlayerOpen: (open: boolean) => void;
  isEditPlayerOpen: boolean;
  setIsEditPlayerOpen: (open: boolean) => void;
  isRemovePlayerOpen: boolean;
  setIsRemovePlayerOpen: (open: boolean) => void;
  isPlayerDetailsOpen: boolean;
  setIsPlayerDetailsOpen: (open: boolean) => void;
  selectedPlayer: Player | null;
  teamId: string;
  canManageTeam: boolean;
  onAddPlayer: (player: Omit<Player, "id" | "created_at">) => Promise<boolean>;
  onEditPlayer: (
    playerId: string,
    updatedPlayerData: Partial<Player>
  ) => Promise<boolean>;
  onRemovePlayer: (playerId: string) => Promise<boolean>;
  onRemovePlayerClick: () => void;
  onEditPlayerClick: () => void;
}

const TeamDetailsPlayerDialogs = ({
  isAddPlayerOpen,
  setIsAddPlayerOpen,
  isEditPlayerOpen,
  setIsEditPlayerOpen,
  isRemovePlayerOpen,
  setIsRemovePlayerOpen,
  isPlayerDetailsOpen,
  setIsPlayerDetailsOpen,
  selectedPlayer,
  teamId,
  canManageTeam,
  onAddPlayer,
  onEditPlayer,
  onRemovePlayer,
  onRemovePlayerClick,
  onEditPlayerClick,
}: TeamDetailsPlayerDialogsProps) => {
  const handleAddPlayer = async (player: Omit<Player, "id" | "created_at">) => {
    try {
      const success = await onAddPlayer(player);
      if (success) {
        setIsAddPlayerOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding player:", error);
      return false;
    }
  };

  const handleEditPlayer = async (
    playerId: string,
    updatedPlayerData: Partial<Player>
  ) => {
    try {
      const success = await onEditPlayer(playerId, updatedPlayerData);
      if (success) {
        setIsEditPlayerOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error editing player:", error);
      return false;
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      const success = await onRemovePlayer(playerId);
      if (success) {
        setIsRemovePlayerOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing player:", error);
      return false;
    }
  };

  return (
    <>
      {/* Player Dialogs - Only show for team managers */}
      {canManageTeam && (
        <>
          <AddPlayerDialog
            open={isAddPlayerOpen}
            onOpenChange={setIsAddPlayerOpen}
            onAddPlayer={handleAddPlayer}
            teamId={teamId}
          />

          <EditPlayerDialog
            open={isEditPlayerOpen}
            onOpenChange={setIsEditPlayerOpen}
            player={selectedPlayer}
            onEditPlayer={handleEditPlayer}
          />

          <RemovePlayerDialog
            open={isRemovePlayerOpen}
            onOpenChange={setIsRemovePlayerOpen}
            player={selectedPlayer}
            onRemovePlayer={handleRemovePlayer}
          />
        </>
      )}

      {/* Player Details Dialog - Show for everyone but with limited actions */}
      <PlayerDetailsDialog
        open={isPlayerDetailsOpen}
        onOpenChange={setIsPlayerDetailsOpen}
        player={selectedPlayer}
        onRemovePlayer={canManageTeam ? onRemovePlayerClick : undefined}
        onEditPlayer={canManageTeam ? onEditPlayerClick : undefined}
      />
    </>
  );
};

export default TeamDetailsPlayerDialogs;
