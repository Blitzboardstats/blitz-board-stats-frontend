
import React from 'react';
import { Search as SearchIcon, Plus } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isCoach: boolean;
  onCreateTeam: () => void;
}

const SearchHeader = ({ searchTerm, onSearchChange, isCoach, onCreateTeam }: SearchHeaderProps) => {
  return (
    <>
      <Header title="Search Teams" />
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 mr-3">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for teams..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-blitz-darkgray border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        
        {isCoach && (
          <Button 
            onClick={onCreateTeam}
            className="bg-blitz-green hover:bg-blitz-green/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        )}
      </div>
    </>
  );
};

export default SearchHeader;
