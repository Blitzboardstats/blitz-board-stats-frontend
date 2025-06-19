
import { useState, useEffect } from 'react';

interface LocationSuggestion {
  address: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

export const useLocationSearch = () => {
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced location search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationQuery.length >= 3) {
        searchLocations(locationQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [locationQuery]);

  const searchLocations = async (query: string) => {
    setIsSearching(true);
    try {
      let results: LocationSuggestion[] = [];
      
      // Search specifically for sports facilities, parks, and schools in California
      const sportsKeywords = ['field', 'stadium', 'park', 'school', 'high school', 'college', 'university', 'sports complex', 'athletic', 'gymnasium', 'gym'];
      const enhancedQuery = `${query} California`;
      
      // Try Nominatim with sports-focused categories
      try {
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enhancedQuery)}&limit=8&countrycodes=us&addressdetails=1&extratags=1&namedetails=1&class=leisure,amenity,landuse&type=sports_centre,pitch,stadium,track,school,college,university,recreation_ground`
        );
        const nominatimData = await nominatimResponse.json();
        
        const nominatimResults: LocationSuggestion[] = nominatimData
          .filter((item: any) => {
            // Filter for California locations and sports-related venues
            const isInCalifornia = item.address?.state === 'California' || item.display_name?.includes('California');
            const isSportsRelated = sportsKeywords.some(keyword => 
              item.display_name?.toLowerCase().includes(keyword) ||
              item.type?.toLowerCase().includes(keyword) ||
              item.class?.toLowerCase().includes('leisure') ||
              item.class?.toLowerCase().includes('amenity')
            );
            return isInCalifornia && (isSportsRelated || item.class === 'amenity' || item.class === 'leisure');
          })
          .map((item: any) => ({
            address: item.display_name,
            description: `${item.type || 'Sports venue'} • ${item.address?.city || item.address?.town || 'California'}`,
            coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
          }));
        
        results = [...results, ...nominatimResults];
      } catch (error) {
        console.log('Nominatim search failed:', error);
      }

      // If we need more results, try a broader California search
      if (results.length === 0) {
        try {
          const broadResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' sports park school California')}&limit=5&countrycodes=us&addressdetails=1`
          );
          const broadData = await broadResponse.json();
          
          const broadResults: LocationSuggestion[] = broadData
            .filter((item: any) => item.address?.state === 'California' || item.display_name?.includes('California'))
            .map((item: any) => ({
              address: item.display_name,
              description: 'Location in California',
              coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
            }));
          
          results = [...results, ...broadResults];
        } catch (error) {
          console.log('Broad search failed:', error);
        }
      }

      // Remove duplicates based on similar addresses
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => 
          r.address.toLowerCase().substring(0, 30) === result.address.toLowerCase().substring(0, 30)
        )
      );

      // If still no results, create a manual entry option
      if (uniqueResults.length === 0) {
        uniqueResults.push({
          address: query + ', California',
          description: 'Use this address as entered',
          coordinates: undefined
        });
      }
      
      setSuggestions(uniqueResults.slice(0, 8)); // Limit to 8 results
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([{
        address: query + ', California',
        description: 'Use this address as entered',
        coordinates: undefined
      }]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    locationQuery,
    setLocationQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearching
  };
};
