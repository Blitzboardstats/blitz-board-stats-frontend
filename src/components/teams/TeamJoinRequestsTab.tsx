
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, User } from 'lucide-react';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';
import { usePermissions } from '@/hooks/usePermissions';

interface TeamJoinRequestsTabProps {
  teamId?: string;
}

const TeamJoinRequestsTab = ({ teamId }: TeamJoinRequestsTabProps) => {
  const { requests, isLoading, fetchCoachRequests, approveRequest, rejectRequest } = useTeamJoinRequests();
  const { permissions } = usePermissions(teamId);

  useEffect(() => {
    if (permissions.canViewAllPlayerStats && teamId) {
      fetchCoachRequests(teamId);
    }
  }, [teamId, permissions.canViewAllPlayerStats]);

  const handleApprove = async (requestId: string) => {
    const success = await approveRequest(requestId);
    if (success) {
      fetchCoachRequests(teamId);
    }
  };

  const handleReject = async (requestId: string) => {
    const success = await rejectRequest(requestId);
    if (success) {
      fetchCoachRequests(teamId);
    }
  };

  if (!permissions.canViewAllPlayerStats) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">You don't have permission to view team join requests.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blitz-purple"></div>
            <span className="text-gray-400">Loading join requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blitz-purple" />
            <span>Pending Join Requests</span>
            {requests.length > 0 && (
              <Badge className="bg-blitz-purple/20 text-blitz-purple">
                {requests.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Pending Requests</h3>
              <p className="text-gray-400">
                There are no pending join requests for this team at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-blitz-charcoal border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          Player: {request.player_name}
                        </h4>
                        <p className="text-sm text-gray-400 mb-1">
                          Guardian: {request.guardian_email}
                        </p>
                        {request.player_jersey_number && (
                          <p className="text-sm text-gray-400 mb-1">
                            Requested Jersey #: {request.player_jersey_number}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Requested: {new Date(request.created_at).toLocaleDateString()} at{' '}
                          {new Date(request.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
                        Pending
                      </Badge>
                    </div>

                    {request.message && (
                      <div className="mb-4 p-3 bg-blitz-darkgray rounded border border-gray-600">
                        <p className="text-sm text-gray-300">
                          <strong>Message:</strong> {request.message}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamJoinRequestsTab;
