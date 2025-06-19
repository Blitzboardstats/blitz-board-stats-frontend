
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchStatesProps {
  isLoading: boolean;
  searchTerm: string;
  teamsCount: number;
  onLogin: () => void;
}

export const LoadingState = () => (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple mx-auto"></div>
    <p className="text-black mt-2">Searching teams...</p>
  </div>
);

export const EmptySearchState = ({ searchTerm }: { searchTerm: string }) => (
  <div className="text-center py-8">
    <p className="text-black">No teams found matching "{searchTerm}"</p>
  </div>
);

export const InitialState = () => (
  <div className="text-center py-8">
    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <p className="text-black">Enter a team name to start searching</p>
  </div>
);

export const UnauthenticatedState = ({ onLogin }: { onLogin: () => void }) => (
  <div className="text-center py-8">
    <p className="text-black">Please log in to search and join teams.</p>
    <Button 
      onClick={onLogin} 
      className="mt-4 bg-blitz-purple hover:bg-blitz-purple/90"
    >
      Go to Login
    </Button>
  </div>
);

const SearchStates = ({ isLoading, searchTerm, teamsCount, onLogin }: SearchStatesProps) => {
  if (isLoading) return <LoadingState />;
  if (!searchTerm) return <InitialState />;
  if (teamsCount === 0 && searchTerm) return <EmptySearchState searchTerm={searchTerm} />;
  return null;
};

export default SearchStates;
