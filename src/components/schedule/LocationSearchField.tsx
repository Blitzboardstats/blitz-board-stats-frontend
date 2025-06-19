
import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useLocationSearch';

interface LocationSearchFieldProps {
  value: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationSearchField = ({ value, onInputChange }: LocationSearchFieldProps) => {
  const {
    locationQuery,
    setLocationQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearching
  } = useLocationSearch();

  // Update location query when value changes - but only if it's different
  React.useEffect(() => {
    if (value !== locationQuery) {
      setLocationQuery(value);
    }
  }, [value]);

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocationQuery(inputValue);
    setShowSuggestions(true);
    
    // Update the parent component
    onInputChange(e);
  };

  const handleLocationSelect = (location: string) => {
    setLocationQuery(location);
    setShowSuggestions(false);
    
    // Create a synthetic event to update the parent state
    const syntheticEvent = {
      target: {
        name: 'location',
        value: location
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent);
  };

  const clearLocation = () => {
    setLocationQuery('');
    setShowSuggestions(false);
    const syntheticEvent = {
      target: {
        name: 'location',
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(syntheticEvent);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Location
      </label>
      <div className="relative">
        <input 
          type="text" 
          name="location"
          className="input-field pr-20 text-base" 
          placeholder="Search for sports parks, schools..."
          value={locationQuery}
          onChange={handleLocationInputChange}
          onFocus={() => setShowSuggestions(true)}
          required
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {locationQuery && (
            <button
              type="button"
              onClick={clearLocation}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          )}
          <Search className="text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Location Suggestions Dropdown */}
      {showSuggestions && (locationQuery.length >= 3 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-blitz-darkgray border border-gray-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-center text-sm text-gray-400">
              Searching sports venues in California...
            </div>
          )}
          
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-700">
                Sports Venues & Schools
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-3 py-3 text-left hover:bg-gray-700 flex items-start space-x-2"
                  onClick={() => handleLocationSelect(suggestion.address)}
                >
                  <MapPin className="mt-0.5 text-[#00ff00] flex-shrink-0" size={16} />
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{suggestion.address}</div>
                    <div className="text-xs text-gray-400">{suggestion.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!isSearching && suggestions.length === 0 && locationQuery.length >= 3 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No sports venues found. Try searching for "field", "park", or "school".
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        Search for sports parks, fields, schools, or stadiums in California
      </p>
    </div>
  );
};

export default LocationSearchField;
