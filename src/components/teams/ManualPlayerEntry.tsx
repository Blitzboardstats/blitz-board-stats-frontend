import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from "@/types/playerTypes";

interface ManualPlayerEntryProps {
  onImportPlayers: (players: Player[]) => Promise<boolean>;
  teamId: string;
  onCancel: () => void;
}

interface ManualPlayerRow {
  playerFirstName: string;
  playerLastName: string;
  jerseyNumber: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianEmail: string;
}

const emptyRow: ManualPlayerRow = {
  playerFirstName: "",
  playerLastName: "",
  jerseyNumber: "",
  guardianFirstName: "",
  guardianLastName: "",
  guardianEmail: "",
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateNumber(value: string) {
  return /^\d+$/.test(value);
}

const ManualPlayerEntry = ({
  onImportPlayers,
  teamId,
  onCancel,
}: ManualPlayerEntryProps) => {
  const [rows, setRows] = useState<ManualPlayerRow[]>([{ ...emptyRow }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    [idx: number]: { email?: string; jersey?: string };
  }>({});

  const handleChange = (
    idx: number,
    field: keyof ManualPlayerRow,
    value: string
  ) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
    // Validate on change
    setErrors((prev) => {
      const updated = { ...prev };
      if (!updated[idx]) updated[idx] = {};
      if (field === "guardianEmail") {
        updated[idx].email =
          value && !validateEmail(value) ? "Invalid email address" : undefined;
      }
      if (field === "jerseyNumber") {
        updated[idx].jersey =
          value && !validateNumber(value)
            ? "Jersey must be a number"
            : undefined;
      }
      return updated;
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  const handleRemoveRow = (idx: number) => {
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)
    );
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[idx];
      return updated;
    });
  };

  const validateAll = () => {
    const newErrors: { [idx: number]: { email?: string; jersey?: string } } =
      {};
    rows.forEach((row, idx) => {
      if (row.guardianEmail && !validateEmail(row.guardianEmail)) {
        if (!newErrors[idx]) newErrors[idx] = {};
        newErrors[idx].email = "Invalid email address";
      }
      if (row.jerseyNumber && !validateNumber(row.jerseyNumber)) {
        if (!newErrors[idx]) newErrors[idx] = {};
        newErrors[idx].jersey = "Jersey must be a number";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setIsProcessing(true);
    const players: Player[] = rows.map((row) => ({
      id: `player-${Date.now()}-${Math.random()}`,
      team_id: teamId,
      name: `${row.playerFirstName} ${row.playerLastName}`.trim(),
      position: "",
      jersey_number: row.jerseyNumber,
      guardian_name: `${row.guardianFirstName} ${row.guardianLastName}`.trim(),
      guardian_email: row.guardianEmail,
      photo_url: undefined,
      graduation_year: undefined,
      recruit_profile: "",
      created_at: new Date(),
    }));
    console.log("Importing players:", players);
    const success = await onImportPlayers(players);
    setIsProcessing(false);
    if (success) {
      setRows([{ ...emptyRow }]);
      setErrors({});
    }
  };

  const hasErrors = Object.values(errors).some(
    (err) => err.email || err.jersey
  );

  return (
    <div className="space-y-6">
      {rows.map((row, idx) => (
        <div
          key={idx}
          className="border border-gray-700 rounded-xl p-6 mb-2 bg-blitz-darkgray shadow-lg relative"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blitz-purple">
              Player {idx + 1}
            </h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveRow(idx)}
              disabled={rows.length === 1}
            >
              Remove
            </Button>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-200">
              Player Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={row.playerFirstName}
                onChange={(e) =>
                  handleChange(idx, "playerFirstName", e.target.value)
                }
                placeholder="Player First Name"
                className="text-black"
              />
              <Input
                value={row.playerLastName}
                onChange={(e) =>
                  handleChange(idx, "playerLastName", e.target.value)
                }
                placeholder="Player Last Name"
                className="text-black"
              />
              <Input
                value={row.jerseyNumber}
                onChange={(e) =>
                  handleChange(idx, "jerseyNumber", e.target.value)
                }
                placeholder="Jersey #"
                className="text-black"
              />
              {errors[idx]?.jersey && (
                <div className="text-red-400 text-xs mt-1">
                  {errors[idx].jersey}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-600 my-4" />
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-gray-200">
              Guardian Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={row.guardianFirstName}
                onChange={(e) =>
                  handleChange(idx, "guardianFirstName", e.target.value)
                }
                placeholder="Guardian First Name"
                className="text-black"
              />
              <Input
                value={row.guardianLastName}
                onChange={(e) =>
                  handleChange(idx, "guardianLastName", e.target.value)
                }
                placeholder="Guardian Last Name"
                className="text-black"
              />
              <Input
                value={row.guardianEmail}
                onChange={(e) =>
                  handleChange(idx, "guardianEmail", e.target.value)
                }
                placeholder="Guardian Email"
                className="text-black"
              />
              {errors[idx]?.email && (
                <div className="text-red-400 text-xs mt-1">
                  {errors[idx].email}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <Button
          onClick={handleAddRow}
          className="bg-blitz-purple hover:bg-blitz-purple/90"
        >
          Add Player
        </Button>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || hasErrors}
          className="bg-blitz-green hover:bg-blitz-green/90"
        >
          {isProcessing
            ? "Importing..."
            : `Import ${rows.length} Player${rows.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
};

export default ManualPlayerEntry;
