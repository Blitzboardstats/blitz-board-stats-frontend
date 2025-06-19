
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useDragDrop } from "./DragDropContext";

interface DraggablePlayerProps {
  player: {
    name: ReactNode;
    id: string;
    number: string;
    position?: string;
  };
  isSelected: boolean;
  onSelect: (playerId: string) => void;
  canEdit: boolean;
  isGameActive: boolean;
}

export const DraggablePlayer = ({
  player,
  isSelected,
  onSelect,
  canEdit,
  isGameActive,
}: DraggablePlayerProps) => {
  const { draggedPlayer, setDraggedPlayer, isDragging } = useDragDrop();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canEdit || !isGameActive) return;

    e.preventDefault();
    setDraggedPlayer(player.id);

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "scale(1.1)";
    target.style.zIndex = "1000";
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!canEdit || !isGameActive) return;

    const target = e.currentTarget as HTMLElement;
    target.style.transform = "";
    target.style.zIndex = "";

    setTimeout(() => {
      setDraggedPlayer(null);
    }, 100);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!canEdit || !isGameActive) return;

    setDraggedPlayer(player.id);
    e.dataTransfer.setData("text/plain", player.id);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
  };

  return (
    <div className='flex-shrink-0'>
      <Button
        className={`w-12 h-12 rounded-full text-white font-bold text-sm transition-all ${
          isSelected
            ? "bg-yellow-600 hover:bg-yellow-700 ring-2 ring-yellow-400"
            : "bg-blue-600 hover:bg-blue-700"
        } ${isDragging && player.id !== draggedPlayer ? "opacity-50" : ""}`}
        disabled={!canEdit || !isGameActive}
        onClick={() => onSelect(player.id)}
        draggable={canEdit && isGameActive}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "none",
          userSelect: "none",
          width: "fit-content",
        }}
      >
        {player?.name}
      </Button>
      <div className='text-[10px] text-gray-400 text-center mt-1 w-12 truncate'>
        {player.position || ""}
      </div>
    </div>
  );
};
