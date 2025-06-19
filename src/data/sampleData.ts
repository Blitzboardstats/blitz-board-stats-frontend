
import { format, addDays } from 'date-fns';
import type { HuddlePost } from '@/types/huddleTypes';

const today = new Date();

export interface Team {
  id: string;
  name: string;
  logo?: string;
  city: string;
  division: string;
  gameType: "Flag" | "Tackle";
  season: string;
  record: string;
}

export interface Player {
  id: string;
  nickname: string;
  jerseyNumber: string;
  photoUrl?: string;
  teamId: string;
  position: string;
  stats: {
    gamesPlayed: number;
    touchdowns: number;
    tackles: number;
    catches: number;
    yards: number;
  }
}

export interface Event {
  id: string;
  title: string;
  type: "Game" | "Practice";
  date: Date;
  time: string;
  location: string;
  opponent?: string;
  teamId: string;
  rsvp?: {
    yes: number;
    no: number;
    maybe: number;
  };
}

// Use export type when re-exporting a type with isolatedModules enabled
export type { HuddlePost } from '@/types/huddleTypes';

export const sampleTeam: Team = {
  id: "panthers-2025",
  name: "Dillon Panthers",
  city: "Dillon, TX",
  division: "Varsity",
  gameType: "Tackle",
  season: "Spring 2025",
  record: "5-2"
};

export const samplePlayers: Player[] = [
  {
    id: "player1",
    nickname: "QB1",
    jerseyNumber: "7",
    photoUrl: "/placeholder.svg",
    teamId: sampleTeam.id,
    position: "Quarterback",
    stats: {
      gamesPlayed: 7,
      touchdowns: 12,
      tackles: 0,
      catches: 0,
      yards: 1450
    }
  },
  {
    id: "player2",
    nickname: "Smash",
    jerseyNumber: "33",
    photoUrl: "/placeholder.svg",
    teamId: sampleTeam.id,
    position: "Running Back",
    stats: {
      gamesPlayed: 7,
      touchdowns: 8,
      tackles: 2,
      catches: 12,
      yards: 685
    }
  },
  {
    id: "player3",
    nickname: "Riggins",
    jerseyNumber: "44",
    photoUrl: "/placeholder.svg",
    teamId: sampleTeam.id,
    position: "Fullback",
    stats: {
      gamesPlayed: 6,
      touchdowns: 5,
      tackles: 0,
      catches: 8,
      yards: 320
    }
  },
  {
    id: "player4",
    nickname: "Saracen",
    jerseyNumber: "6",
    photoUrl: "/placeholder.svg",
    teamId: sampleTeam.id,
    position: "Quarterback",
    stats: {
      gamesPlayed: 3,
      touchdowns: 4,
      tackles: 0,
      catches: 0,
      yards: 580
    }
  },
  {
    id: "player5",
    nickname: "Street",
    jerseyNumber: "12",
    photoUrl: "/placeholder.svg",
    teamId: sampleTeam.id,
    position: "Wide Receiver",
    stats: {
      gamesPlayed: 7,
      touchdowns: 6,
      tackles: 0,
      catches: 28,
      yards: 420
    }
  },
];

export const sampleEvents: Event[] = [
  {
    id: "event1",
    title: "Home Game vs. Lions",
    type: "Game",
    date: addDays(today, 2),
    time: "6:30 PM",
    location: "Dillon High Stadium",
    opponent: "East Dillon Lions",
    teamId: sampleTeam.id,
    rsvp: {
      yes: 18,
      no: 2,
      maybe: 3
    }
  },
  {
    id: "event2",
    title: "Team Practice",
    type: "Practice",
    date: addDays(today, 4),
    time: "4:00 PM",
    location: "Dillon Practice Field",
    teamId: sampleTeam.id,
    rsvp: {
      yes: 20,
      no: 1,
      maybe: 2
    }
  },
  {
    id: "event3",
    title: "Team Practice",
    type: "Practice",
    date: addDays(today, 6),
    time: "4:00 PM",
    location: "Dillon Practice Field",
    teamId: sampleTeam.id,
    rsvp: {
      yes: 16,
      no: 4,
      maybe: 3
    }
  },
  {
    id: "event4",
    title: "Away Game vs. Arnett Mead",
    type: "Game",
    date: addDays(today, 9),
    time: "7:00 PM",
    location: "Arnett Mead High School",
    opponent: "Arnett Mead Tigers",
    teamId: sampleTeam.id,
    rsvp: {
      yes: 19,
      no: 2,
      maybe: 2
    }
  },
];

// Empty array since we're now using real Supabase data
export const sampleHuddlePosts: HuddlePost[] = [];
