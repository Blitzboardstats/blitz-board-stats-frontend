import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import GuardianForm from "./guardian/GuardianForm";
import GuardianList from "./guardian/GuardianList";
import GuardianInfoCard from "./guardian/GuardianInfoCard";
import { useGuardianStore } from "@/stores/guardianStore";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

const GuardianManagement = () => {
  const { user } = useAuthStore();
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianName, setGuardianName] = useState("");

  const {
    guardians,
    isLoading,
    error,
    getGuardians,
    addGuardian,
    removeGuardian,
  } = useGuardianStore();

  // Fetch guardians when component mounts
  useEffect(() => {
    if (user?.role === "player") {
      getGuardians();
    }
  }, [user, getGuardians]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!guardianEmail.trim()) return;

    const success = await addGuardian(guardianEmail.trim());
    if (success) {
      toast.success("Guardian added successfully");
      setGuardianEmail("");
      setGuardianName("");
    }
  };

  const handleDeleteGuardian = async (relationshipId: string) => {
    const success = await removeGuardian(relationshipId);
    if (success) {
      toast.success("Guardian removed successfully");
    }
  };

  if (user?.role !== "player") {
    return null;
  }

  if (isLoading) {
    return (
      <Card className='bg-blitz-charcoal border-gray-800 text-white'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-white'>
            <Users className='h-5 w-5' />
            Guardian Management
          </CardTitle>
          <CardDescription className='text-gray-400'>
            Loading guardian information...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <GuardianForm
        guardianEmail={guardianEmail}
        guardianName={guardianName}
        onEmailChange={setGuardianEmail}
        onNameChange={setGuardianName}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <GuardianList
        guardians={guardians}
        onDeleteGuardian={handleDeleteGuardian}
        isLoading={isLoading}
      />

      <GuardianInfoCard />
    </div>
  );
};

export default GuardianManagement;
