
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDragDrop } from './DragDropContext';

interface DroppableActionButtonProps {
  label: string;
  color: string;
  points?: number;
  onClick: (playerId?: string) => void;
  width?: string;
  canEdit: boolean;
  isGameActive: boolean;
}

export const DroppableActionButton = ({
  label,
  color,
  points,
  onClick,
  width = 'w-16',
  canEdit,
  isGameActive
}: DroppableActionButtonProps) => {
  const { draggedPlayer, isDragging } = useDragDrop();
  const [isHovered, setIsHovered] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPlayer && canEdit && isGameActive) {
      onClick(draggedPlayer);
    }
    setIsHovered(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedPlayer) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverButton = element?.closest('[data-action-button]') === e.currentTarget;
    
    setIsHovered(isOverButton);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !draggedPlayer) return;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverButton = element?.closest('[data-action-button]') === e.currentTarget;
    
    if (isOverButton && canEdit && isGameActive) {
      onClick(draggedPlayer);
    }
    
    setIsHovered(false);
  };

  return (
    <div className="flex-shrink-0">
      <Button
        data-action-button
        className={`${width} h-12 text-white font-bold text-[10px] ${color} rounded-lg relative transition-all ${
          isHovered && isDragging ? 'ring-2 ring-yellow-400 scale-105' : ''
        }`}
        disabled={!canEdit || !isGameActive}
        onClick={() => onClick()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center">
          <div className="leading-tight">{label}</div>
          {points && (
            <div className="text-[8px] bg-yellow-500 text-black rounded px-1 mt-1">
              +{points}
            </div>
          )}
        </div>
        {isHovered && isDragging && (
          <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-lg"></div>
        )}
      </Button>
    </div>
  );
};
