
import React from "react";
import { DragDropProvider } from "./DragDropContext";
import { LiveGameLayout } from "./LiveGameLayout";

interface LiveGameInterfaceProps {
  canEdit: boolean;
  selectedTeam: any;
  isGameActive?: boolean;
  canManageGame?: boolean;
  onStartGame?: () => void;
  onPauseGame?: () => void;
  onEndGame?: () => void;
  onUndo?: () => void;
}

export const LiveGameInterface = ({
  canEdit,
  selectedTeam,
  isGameActive = false,
  canManageGame = false,
  onStartGame = () => {},
  onPauseGame = () => {},
  onEndGame = () => {},
  onUndo = () => {}
}: LiveGameInterfaceProps) => {
  return (
    <DragDropProvider>
      <LiveGameLayout 
        canEdit={canEdit} 
        selectedTeam={selectedTeam}
        isGameActive={isGameActive}
        canManageGame={canManageGame}
        onStartGame={onStartGame}
        onPauseGame={onPauseGame}
        onEndGame={onEndGame}
        onUndo={onUndo}
      />
    </DragDropProvider>
  );
};
