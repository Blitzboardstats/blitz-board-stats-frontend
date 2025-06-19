
export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  location: string;
  type: 'Game' | 'Practice' | 'Tournament';
  opponent?: string;
  teamCount?: number;
  teamId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  duration?: 40 | 48 | 50;
  matchupFormat?: 'Halves' | 'Quarters';
  notes?: string;
  ageGroups?: string[];
  eventTeams?: EventTeam[];
}

export interface EventTeam {
  id: string;
  event_id: string;
  team_id: string;
  created_at: string;
}

export interface NewEventForm {
  title: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  type: 'Game' | 'Practice' | 'Tournament';
  opponent: string;
  teamCount?: number;
  teamId: string;
  duration?: 40 | 48 | 50;
  matchupFormat?: 'Halves' | 'Quarters';
  notes?: string;
  ageGroups?: string[];
  endDate?: string;
  prizeDetails?: string;
  registrationFee?: string;
  selectedTeams?: string[]; // For multi-team events
  isMultiTeam?: boolean;
}
