
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface AgeGroupSelectorProps {
  selectedAgeGroups: string[];
  onAgeGroupsChange: (ageGroups: string[]) => void;
  availableAgeGroups: string[];
}

const AgeGroupSelector = ({ 
  selectedAgeGroups, 
  onAgeGroupsChange, 
  availableAgeGroups 
}: AgeGroupSelectorProps) => {
  const handleAgeGroupToggle = (ageGroup: string, checked: boolean) => {
    if (checked) {
      onAgeGroupsChange([...selectedAgeGroups, ageGroup]);
    } else {
      onAgeGroupsChange(selectedAgeGroups.filter(ag => ag !== ageGroup));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Age Groups (Tournament applies to)
      </label>
      <div className="space-y-2">
        {availableAgeGroups.map((ageGroup) => (
          <div key={ageGroup} className="flex items-center space-x-2">
            <Checkbox
              id={`age-group-${ageGroup}`}
              checked={selectedAgeGroups.includes(ageGroup)}
              onCheckedChange={(checked) => 
                handleAgeGroupToggle(ageGroup, checked as boolean)
              }
              className="border-gray-500 data-[state=checked]:bg-[#00ff00] data-[state=checked]:text-black"
            />
            <label 
              htmlFor={`age-group-${ageGroup}`} 
              className="text-sm font-medium text-gray-300"
            >
              {ageGroup}
            </label>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Select which age groups this tournament applies to
      </p>
    </div>
  );
};

export default AgeGroupSelector;
