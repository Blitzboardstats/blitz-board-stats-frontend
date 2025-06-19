
import React from 'react';
import { usePlayerPermissions } from '@/hooks/usePlayerPermissions';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Eye } from 'lucide-react';

interface PlayerGuardianIndicatorProps {
  playerId: string;
  className?: string;
}

export const PlayerGuardianIndicator = ({ playerId, className = "" }: PlayerGuardianIndicatorProps) => {
  const { permissions, isLoading } = usePlayerPermissions(playerId);

  if (isLoading) {
    return null;
  }

  if (permissions.isGuardian) {
    return (
      <Badge variant="secondary" className={`bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200 transition-colors ${className}`}>
        <Heart className="w-3 h-3 mr-1 fill-current" />
        My Child
      </Badge>
    );
  }

  if (permissions.canView && !permissions.isGuardian) {
    return (
      <Badge variant="outline" className={`border-blue-500/50 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ${className}`}>
        <Eye className="w-3 h-3 mr-1" />
        Can View
      </Badge>
    );
  }

  return null;
};
