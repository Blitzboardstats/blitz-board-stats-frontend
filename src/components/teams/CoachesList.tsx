
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Phone, Mail, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeamCoach } from '@/types/teamTypes';
import { Player } from '@/types/playerTypes';
import CoachGuardianIndicator from './CoachGuardianIndicator';

interface CoachesListProps {
  coaches: TeamCoach[];
  players?: Player[];
  onCoachClick?: (coach: TeamCoach) => void;
  onRemoveCoach?: (coach: TeamCoach) => void;
  onEditCoach?: (coach: TeamCoach) => void;
  onResendInvitation?: (coach: TeamCoach) => void;
  canManageTeam?: boolean;
}

const CoachesList = ({
  coaches,
  players = [],
  onCoachClick,
  onRemoveCoach,
  onEditCoach,
  onResendInvitation,
  canManageTeam = false
}: CoachesListProps) => {
  if (coaches.length === 0) {
    return (
      <Card className="bg-blitz-darkgray border border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400">
            No coaches have been added to this team yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Head Coach':
        return 'bg-blitz-purple text-white';
      case 'Assistant Coach':
        return 'bg-blue-600 text-white';
      case 'Statistician':
        return 'bg-green-600 text-white';
      case 'Team Manager':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-3">
      {coaches.map((coach) => (
        <Card 
          key={coach.id} 
          className="bg-blitz-darkgray border border-gray-800 hover:border-blitz-purple/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 
                    className={`font-semibold text-black ${canManageTeam && onCoachClick ? 'cursor-pointer hover:text-blitz-purple' : ''}`}
                    onClick={() => canManageTeam && onCoachClick && onCoachClick(coach)}
                  >
                    {coach.name}
                  </h3>
                  <Badge className={getRoleBadgeColor(coach.role)}>
                    {coach.role}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-black">
                  {coach.email && (
                    <div className="flex items-center">
                      <Mail size={14} className="mr-2" />
                      {coach.email}
                    </div>
                  )}
                  {coach.phone && (
                    <div className="flex items-center">
                      <Phone size={14} className="mr-2" />
                      {coach.phone}
                    </div>
                  )}
                </div>

                {/* Show coach-guardian relationship */}
                <CoachGuardianIndicator coach={coach} players={players} />
              </div>
              
              {canManageTeam && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-blitz-darkgray border-gray-700">
                    {onEditCoach && (
                      <DropdownMenuItem 
                        onClick={() => onEditCoach(coach)}
                        className="hover:bg-blitz-gray text-black"
                      >
                        Edit Coach
                      </DropdownMenuItem>
                    )}
                    {onResendInvitation && coach.email && (
                      <DropdownMenuItem 
                        onClick={() => onResendInvitation(coach)}
                        className="hover:bg-blitz-gray text-black"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Resend Invitation
                      </DropdownMenuItem>
                    )}
                    {onRemoveCoach && (
                      <DropdownMenuItem 
                        onClick={() => onRemoveCoach(coach)}
                        className="hover:bg-red-600/30 text-red-400"
                      >
                        Remove Coach
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoachesList;
