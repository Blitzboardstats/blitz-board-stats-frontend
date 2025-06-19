
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { useTeamJoinRequests } from '@/hooks/useTeamJoinRequests';
import FindTeamsDialog from './FindTeamsDialog';

const GuardianTeamRequests = () => {
  const { requests, isLoading } = useTeamJoinRequests();
  const [isFindTeamsOpen, setIsFindTeamsOpen] = React.useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blitz-purple"></div>
            <span className="text-gray-400">Loading your team requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-blitz-darkgray border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blitz-purple" />
            <span>Team Join Requests</span>
          </CardTitle>
          <Button
            onClick={() => setIsFindTeamsOpen(true)}
            className="bg-blitz-purple hover:bg-blitz-purple/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Teams
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Team Requests Yet</h3>
              <p className="text-gray-400 mb-4">
                You haven't submitted any requests to join teams. Use the "Find Teams" button to search for teams your player can join.
              </p>
              <Button
                onClick={() => setIsFindTeamsOpen(true)}
                className="bg-blitz-purple hover:bg-blitz-purple/90"
              >
                <Search className="h-4 w-4 mr-2" />
                Find Teams to Join
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-blitz-charcoal border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {request.team?.name || 'Team Request'}
                        </h4>
                        <p className="text-sm text-gray-400 mb-1">
                          Player: {request.player_name}
                        </p>
                        {request.player_jersey_number && (
                          <p className="text-sm text-gray-400 mb-1">
                            Jersey #: {request.player_jersey_number}
                          </p>
                        )}
                        {request.team && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="bg-blitz-purple/20 text-blitz-purple text-xs">
                              {request.team.football_type}
                            </Badge>
                            {request.team.age_group && (
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 text-xs">
                                {request.team.age_group}
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(request.status)}
                        {getStatusIcon(request.status)}
                      </div>
                    </div>

                    {request.message && (
                      <div className="mt-3 p-3 bg-blitz-darkgray rounded border border-gray-600">
                        <p className="text-sm text-gray-300">
                          <strong>Your message:</strong> {request.message}
                        </p>
                      </div>
                    )}

                    {request.status === 'approved' && request.approved_at && (
                      <div className="mt-3 p-2 bg-green-500/10 rounded border border-green-500/20">
                        <p className="text-sm text-green-400">
                          ✓ Approved on {new Date(request.approved_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FindTeamsDialog
        open={isFindTeamsOpen}
        onOpenChange={setIsFindTeamsOpen}
      />
    </>
  );
};

export default GuardianTeamRequests;
