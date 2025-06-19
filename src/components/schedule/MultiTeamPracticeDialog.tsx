import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventMutations } from "@/hooks/useEventMutations";
import { NewEventForm } from "@/types/eventTypes";
import { toast } from "sonner";
import { Team } from "@/types/teamTypes";

interface MultiTeamPracticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userTeams: Team[];
}

const COASTAL_CRUSH_AGE_GROUPS = ["12U", "14U", "14 Elite", "17U"];

const MultiTeamPracticeDialog = ({
  open,
  onOpenChange,
  userTeams,
}: MultiTeamPracticeDialogProps) => {
  const { createEvent, isCreating } = useEventMutations();
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>(
    COASTAL_CRUSH_AGE_GROUPS
  );
  const [practiceDate, setPracticeDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:30");
  const [notes, setNotes] = useState("");

  // Find teams that match the selected age groups
  const matchingTeams = userTeams.filter((team) =>
    selectedAgeGroups.includes(team.ageGroup || "")
  );

  const handleAgeGroupToggle = (ageGroup: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(ageGroup)
        ? prev.filter((ag) => ag !== ageGroup)
        : [...prev, ageGroup]
    );
  };

  const handleCreatePractice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAgeGroups.length === 0) {
      toast.error("Please select at least one age group");
      return;
    }

    if (!practiceDate) {
      toast.error("Please select a practice date");
      return;
    }

    // Use the first matching team as the primary team, or first user team if no matches
    const primaryTeam = matchingTeams[0] || userTeams[0];

    if (!primaryTeam) {
      toast.error("No teams available");
      return;
    }

    const newEvent: NewEventForm = {
      title: `Multi-Team Practice - ${selectedAgeGroups.join(", ")}`,
      date: practiceDate,
      time: startTime,
      endTime: endTime,
      location: "La Costa Canyon High School",
      type: "Practice",
      opponent: "",
      teamId: primaryTeam.id,
      isMultiTeam: true,
      selectedTeams: matchingTeams.map((team) => team.id),
      ageGroups: selectedAgeGroups,
      notes:
        notes ||
        `Multi-team practice for Coastal Crush age groups: ${selectedAgeGroups.join(
          ", "
        )}`,
    };

    console.log("Creating multi-team practice:", newEvent);

    createEvent(newEvent);
    onOpenChange(false);

    // Reset form
    setSelectedAgeGroups(COASTAL_CRUSH_AGE_GROUPS);
    setPracticeDate("");
    setStartTime("18:00");
    setEndTime("19:30");
    setNotes("");

    toast.success(
      `Multi-team practice created for ${selectedAgeGroups.join(", ")} teams`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-blitz-darkgray border-gray-700 text-white max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create Multi-Team Practice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreatePractice} className='space-y-6'>
          {/* Age Group Selection */}
          <Card className='bg-blitz-charcoal border-gray-600'>
            <CardHeader>
              <CardTitle className='text-sm'>
                Select Coastal Crush Age Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3'>
                {COASTAL_CRUSH_AGE_GROUPS.map((ageGroup) => {
                  const matchingTeam = userTeams.find(
                    (team) => team.ageGroup === ageGroup
                  );
                  const isSelected = selectedAgeGroups.includes(ageGroup);

                  return (
                    <div
                      key={ageGroup}
                      className='flex items-center space-x-3 p-2 rounded border border-gray-600'
                    >
                      <Checkbox
                        id={ageGroup}
                        checked={isSelected}
                        onCheckedChange={() => handleAgeGroupToggle(ageGroup)}
                        className='border-gray-500'
                      />
                      <Label htmlFor={ageGroup} className='flex-1'>
                        <div className='font-medium'>{ageGroup}</div>
                        {matchingTeam ? (
                          <div className='text-xs text-green-400'>
                            ✓ {matchingTeam.name}
                          </div>
                        ) : (
                          <div className='text-xs text-gray-400'>
                            No team found
                          </div>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>

              {selectedAgeGroups.length > 0 && (
                <div className='mt-3 p-3 bg-blitz-purple/20 rounded border border-blitz-purple/50'>
                  <div className='text-sm font-medium text-blitz-purple'>
                    Selected: {selectedAgeGroups.join(", ")}
                  </div>
                  <div className='text-xs text-gray-300 mt-1'>
                    {matchingTeams.length} team(s) will receive this practice
                    invitation
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Practice Details */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='practiceDate'>Practice Date</Label>
              <Input
                id='practiceDate'
                type='date'
                value={practiceDate}
                onChange={(e) => setPracticeDate(e.target.value)}
                className='bg-gray-800 border-gray-700'
                required
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value='La Costa Canyon High School'
                disabled
                className='bg-gray-800 border-gray-700 text-gray-400'
              />
            </div>

            <div>
              <Label htmlFor='startTime'>Start Time</Label>
              <Input
                id='startTime'
                type='time'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className='bg-gray-800 border-gray-700'
                required
              />
            </div>

            <div>
              <Label htmlFor='endTime'>End Time</Label>
              <Input
                id='endTime'
                type='time'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className='bg-gray-800 border-gray-700'
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Practice Notes (Optional)</Label>
            <Input
              id='notes'
              placeholder='e.g., Focus on passing drills, bring water bottles...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className='bg-gray-800 border-gray-700'
            />
          </div>

          {/* Summary */}
          {selectedAgeGroups.length > 0 && (
            <Card className='bg-green-900/20 border-green-800'>
              <CardContent className='p-4'>
                <div className='text-sm'>
                  <div className='font-medium text-green-400 mb-2'>
                    Practice Summary:
                  </div>
                  <ul className='space-y-1 text-gray-300'>
                    <li>
                      • <strong>Teams:</strong> {selectedAgeGroups.join(", ")}
                    </li>
                    <li>
                      • <strong>Location:</strong> La Costa Canyon High School
                    </li>
                    <li>
                      • <strong>Players:</strong> All players from selected
                      teams will receive RSVP invitations
                    </li>
                    <li>
                      • <strong>RSVP Options:</strong> Going, Maybe, No, Pending
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='flex gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-blitz-purple hover:bg-blitz-purple/90'
              disabled={isCreating || selectedAgeGroups.length === 0}
            >
              {isCreating
                ? "Creating Practice..."
                : "Create Multi-Team Practice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MultiTeamPracticeDialog;
