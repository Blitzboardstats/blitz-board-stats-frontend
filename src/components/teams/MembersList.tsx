
import React from 'react';
import { TeamMember } from '@/types/teamTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MembersListProps {
  members: TeamMember[];
  onRemoveMember?: (member: TeamMember) => void;
  canManageTeam?: boolean;
}

const MembersList = ({
  members,
  onRemoveMember,
  canManageTeam = false
}: MembersListProps) => {
  if (members.length === 0) {
    return (
      <Card className="bg-blitz-darkgray border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">
            No members have been added to this team yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-blitz-darkgray border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-800">
              <TableHead className="text-black font-semibold">Member</TableHead>
              <TableHead className="text-black font-semibold">Email</TableHead>
              {canManageTeam && <TableHead className="text-black font-semibold w-20">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow 
                key={member.id} 
                className="border-b border-gray-800 hover:bg-blitz-darkgray/50"
              >
                <TableCell className="font-medium text-black">
                  {member.display_name || 'Unknown Member'}
                </TableCell>
                <TableCell className="text-black">
                  {member.email || 'No email'}
                </TableCell>
                {canManageTeam && (
                  <TableCell>
                    {onRemoveMember && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => onRemoveMember(member)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MembersList;
