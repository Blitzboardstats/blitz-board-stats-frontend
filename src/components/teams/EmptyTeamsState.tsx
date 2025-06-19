
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface EmptyTeamsStateProps {
  isCoach: boolean;
  onCreateTeam: () => void;
}

const EmptyTeamsState = ({ isCoach, onCreateTeam }: EmptyTeamsStateProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-blitz-darkgray border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle>No Teams Yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">
          {isCoach 
            ? "You haven't created any teams yet. Get started by creating your first team."
            : "You haven't joined any teams yet. Use the search feature to find and join teams."
          }
        </p>
        {isCoach ? (
          <Button 
            onClick={onCreateTeam}
            className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Team
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/search')}
            className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
          >
            Search Teams
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyTeamsState;
