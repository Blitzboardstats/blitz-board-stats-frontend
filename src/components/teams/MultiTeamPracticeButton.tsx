import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";
import MultiTeamPracticeDialog from "../schedule/MultiTeamPracticeDialog";
import { Team } from "@/types/teamTypes";

interface MultiTeamPracticeButtonProps {
  userTeams: Team[];
  canCreateEvents: boolean;
}

const MultiTeamPracticeButton = ({
  userTeams,
  canCreateEvents,
}: MultiTeamPracticeButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  if (!canCreateEvents) {
    return null;
  }

  // Check if user has any Coastal Crush teams with relevant age groups
  const coastalCrushTeams = userTeams.filter((team) =>
    ["12U", "14U", "14 Elite", "17U"].includes(team.ageGroup || "")
  );

  if (coastalCrushTeams.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className='bg-gradient-to-r from-blitz-purple to-blitz-green hover:from-blitz-purple/80 hover:to-blitz-green/80 text-white'
      >
        <Users className='w-4 h-4 mr-2' />
        <Calendar className='w-4 h-4 mr-2' />
        Multi-Team Practice
      </Button>

      <MultiTeamPracticeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        userTeams={userTeams}
      />
    </>
  );
};

export default MultiTeamPracticeButton;
