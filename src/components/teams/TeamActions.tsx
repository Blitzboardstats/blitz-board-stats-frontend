/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Settings,
  Trash,
  Users,
  BarChart3,
  FileSpreadsheet,
  Mail,
} from "lucide-react";
import AddPlayerDialog from "./AddPlayerDialog";
import EditTeamDialog from "./EditTeamDialog";
import DeleteTeamDialog from "./DeleteTeamDialog";
import BulkStatsImport from "./BulkStatsImport";
import DirectStatsImport from "./DirectStatsImport";
import InvitePersonDialog from "./InvitePersonDialog";
import MultiTeamPracticeButton from "./MultiTeamPracticeButton";
import BulkPlayerImport from "./BulkPlayerImport";
import { Team } from "@/types/teamTypes";
import { Player } from "@/types/playerTypes";
import { ProcessedPlayerStats } from "@/types/bulkStatsTypes";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useAuthStore, useTeamStore } from "@/stores";
import { toast } from "sonner";

interface TeamActionsProps {
  team: Team;
  players: Player[];
  userTeams: Team[];
  onAddPlayer: (playerData: any) => Promise<boolean>;
  onEditTeam: (teamId: string, updatedData: any) => Promise<boolean>;
  onDeleteTeam: (teamId: string) => Promise<boolean>;
  onImportStats: (stats: ProcessedPlayerStats[]) => Promise<boolean>;
  onAddCoach: () => void;
  canManageTeam: boolean;
}

const TeamActions = ({
  team,
  players,
  userTeams,
  onAddPlayer,
  onEditTeam,
  onDeleteTeam,
  onImportStats,
  onAddCoach,
  canManageTeam,
}: TeamActionsProps) => {
  const { user } = useAuthStore();
  const { bulkImportPlayers } = useTeamStore();

  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [isBulkStatsImportOpen, setIsBulkStatsImportOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDirectStatsImportOpen, setIsDirectStatsImportOpen] = useState(false);
  const [isBulkPlayerImportOpen, setIsBulkPlayerImportOpen] = useState(false);

  const handleBulkImportPlayers = async (
    players: Omit<Player, "id" | "created_at">[]
  ): Promise<boolean> => {
    try {
      const result = await bulkImportPlayers(
        team._id || team.id || "",
        players
      );

      if (typeof result === "object" && "error" in result) {
        toast.error(result.error as string);
        return false;
      } else {
        toast.success("Players imported successfully");
        return true;
      }
    } catch (error) {
      console.error("Error importing players:", error);
      toast.error("Failed to import players");
      return false;
    }
  };

  if (!canManageTeam) {
    return null;
  }

  return (
    <div className='mb-6'>
      <Card className='bg-blitz-darkgray border-gray-700'>
        <CardHeader>
          <CardTitle className='text-lg text-blitz-purple flex items-center gap-2'>
            <Settings className='w-5 h-5 text-blitz-purple' />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            {/* Multi-Team Practice Button - prioritized placement */}
            <MultiTeamPracticeButton
              userTeams={userTeams}
              canCreateEvents={canManageTeam}
            />

            <Button
              onClick={() => setIsInviteDialogOpen(true)}
              className='bg-blitz-green hover:bg-blitz-green/80'
            >
              <Mail className='w-4 h-4 mr-2' />
              Invite Coaching Staff
            </Button>

            {user.role === "guardian" && (
              <Button
                onClick={() => setIsAddPlayerOpen(true)}
                className='bg-blitz-purple hover:bg-blitz-purple/80'
              >
                <UserPlus className='w-4 h-4 mr-2' />
                Add Player
              </Button>
            )}

            <Button
              onClick={() => setIsBulkStatsImportOpen(true)}
              variant='outline'
              className='border-gray-600 text-black hover:bg-gray-700/20'
            >
              <BarChart3 className='w-4 h-4 mr-2' />
              Import Season Stats
            </Button>

            <Button
              onClick={() => setIsDirectStatsImportOpen(true)}
              className='bg-blue-800 text-white hover:bg-blue-900'
            >
              <FileSpreadsheet className='w-4 h-4 mr-2' />
              Import Stats (Direct)
            </Button>

            {user.role === "admin" && (
              <Button
                onClick={onAddCoach}
                variant='outline'
                className='border-gray-600 text-gray-300 hover:bg-gray-700'
              >
                <Users className='w-4 h-4 mr-2' />
                Add Coach
              </Button>
            )}

            <Button
              onClick={() => setIsEditTeamOpen(true)}
              className='bg-teal-600 text-white hover:bg-teal-700'
            >
              <Settings className='w-4 h-4 mr-2' />
              Edit Team
            </Button>

            <Button
              onClick={() => setIsDeleteTeamOpen(true)}
              variant='destructive'
              className='bg-orange-600 hover:bg-orange-700 text-white'
            >
              <Trash className='w-4 h-4 mr-2' />
              Delete Team
            </Button>

            <Button
              onClick={() => setIsBulkPlayerImportOpen(true)}
              className='bg-blitz-purple hover:bg-blitz-purple/90 text-white'
            >
              <UserPlus className='w-4 h-4 mr-2' />
              Add Player Roster
            </Button>
          </div>

          <div className='mt-4 flex items-center gap-2'>
            <Badge variant='outline' className='text-gray-400 border-gray-600'>
              {team.numberOfPlayers} Player
              {team.numberOfPlayers !== 1 ? "s" : ""}
            </Badge>
            <Badge variant='outline' className='text-gray-400 border-gray-600'>
              {team.footballType || "Flag Football"}
            </Badge>
            {team.ageGroup && (
              <Badge
                variant='outline'
                className='text-gray-400 border-gray-600'
              >
                {team.ageGroup}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InvitePersonDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        teamId={team._id}
        teamName={team.name}
        teamType={team.footballType}
      />

      <AddPlayerDialog
        open={isAddPlayerOpen}
        onOpenChange={setIsAddPlayerOpen}
        teamId={team._id}
        onAddPlayer={onAddPlayer}
      />

      <EditTeamDialog
        open={isEditTeamOpen}
        onOpenChange={setIsEditTeamOpen}
        team={team}
        onEditTeam={onEditTeam}
      />

      <DeleteTeamDialog
        open={isDeleteTeamOpen}
        onOpenChange={setIsDeleteTeamOpen}
        team={team}
        onDeleteTeam={onDeleteTeam}
      />

      <BulkStatsImport
        open={isBulkStatsImportOpen}
        onOpenChange={setIsBulkStatsImportOpen}
        teamId={team.id}
        onImportStats={onImportStats}
      />

      <DirectStatsImport
        open={isDirectStatsImportOpen}
        onOpenChange={setIsDirectStatsImportOpen}
        teamId={team.id}
        teamPlayers={players}
        onImportStats={onImportStats}
      />

      <BulkPlayerImport
        open={isBulkPlayerImportOpen}
        onOpenChange={setIsBulkPlayerImportOpen}
        teamId={team.id}
        onImportPlayers={handleBulkImportPlayers}
      />
    </div>
  );
};

export default TeamActions;
