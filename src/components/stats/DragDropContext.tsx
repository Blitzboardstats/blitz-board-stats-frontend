
import React, { createContext, useContext, useState } from 'react';

interface DragDropContextType {
  draggedPlayer: string | null;
  setDraggedPlayer: (playerId: string | null) => void;
  isDragging: boolean;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const DragDropProvider = ({ children }: { children: React.ReactNode }) => {
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);

  return (
    <DragDropContext.Provider value={{
      draggedPlayer,
      setDraggedPlayer,
      isDragging: !!draggedPlayer
    }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }
  return context;
};
