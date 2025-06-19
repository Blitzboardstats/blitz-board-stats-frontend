
import { useState } from 'react';
import { Player } from '@/types/playerTypes';
import { TeamCoach } from '@/types/teamTypes';

export const useTeamDialogs = () => {
  // Player dialog states
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false);
  const [isRemovePlayerOpen, setIsRemovePlayerOpen] = useState(false);
  const [isEditPlayerOpen, setIsEditPlayerOpen] = useState(false);
  
  // Coach management states
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<TeamCoach | null>(null);
  const [isRemoveCoachOpen, setIsRemoveCoachOpen] = useState(false);
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false);
  
  // Team management states
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);

  return {
    // Player states
    isAddPlayerOpen,
    setIsAddPlayerOpen,
    selectedPlayer,
    setSelectedPlayer,
    isPlayerDetailsOpen,
    setIsPlayerDetailsOpen,
    isRemovePlayerOpen,
    setIsRemovePlayerOpen,
    isEditPlayerOpen,
    setIsEditPlayerOpen,
    
    // Coach states
    isAddCoachOpen,
    setIsAddCoachOpen,
    selectedCoach,
    setSelectedCoach,
    isRemoveCoachOpen,
    setIsRemoveCoachOpen,
    isEditCoachOpen,
    setIsEditCoachOpen,
    
    // Team states
    isDeleteTeamOpen,
    setIsDeleteTeamOpen,
    isEditTeamOpen,
    setIsEditTeamOpen,
  };
};
