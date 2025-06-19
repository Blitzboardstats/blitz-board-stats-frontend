import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserCheck, Trash2 } from "lucide-react";
import { Guardian } from "@/stores/guardianStore";

interface GuardianListProps {
  guardians: Guardian[];
  onDeleteRelationship: (relationshipId: string, guardianName?: string) => void;
  isDeletingRelationship: boolean;
}

const GuardianList: React.FC<GuardianListProps> = ({
  guardians,
  onDeleteRelationship,
  isDeletingRelationship,
}) => {
  if (guardians.length === 0) {
    return null;
  }

  return (
    <Card className='bg-blitz-charcoal border-gray-800 text-white'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-white'>
          <UserCheck className='h-5 w-5' />
          Active Guardian Relationships
        </CardTitle>
        <CardDescription className='text-gray-400'>
          Guardians who can access your team and stats information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {guardians.map((guardian, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 border border-gray-700 rounded-lg'
            >
              <div className='flex flex-col'>
                <span className='font-medium text-white'>
                  {guardian.name || "Guardian"}
                </span>
                <span className='text-sm text-gray-400'>{guardian.email}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className='bg-green-50 text-green-700 border-green-200'
                >
                  Connected
                </Badge>
                {guardian._id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                        disabled={isDeletingRelationship}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-blitz-charcoal border-gray-800 text-white'>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-white'>
                          Remove Guardian Relationship
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-gray-400'>
                          Are you sure you want to remove the guardian
                          relationship with {guardian.name || guardian.email}?
                          They will no longer be able to access your team
                          information and stats.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-700 text-white border-gray-600 hover:bg-gray-600'>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            onDeleteRelationship(guardian._id!, guardian.name)
                          }
                          className='bg-red-600 hover:bg-red-700 text-white'
                          disabled={isDeletingRelationship}
                        >
                          {isDeletingRelationship ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardianList;
