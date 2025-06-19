
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry: () => void;
  variant?: 'error' | 'warning';
}

const ErrorDisplay = ({ title, message, onRetry, variant = 'error' }: ErrorDisplayProps) => {
  const colorClasses = variant === 'error' 
    ? 'bg-red-900/20 border-red-800 text-red-300 text-red-400 border-red-600 text-red-400 hover:bg-red-600'
    : 'bg-orange-900/20 border-orange-800 text-orange-300 text-orange-400 border-orange-600 text-orange-400 hover:bg-orange-600';

  return (
    <Card className={`${colorClasses.split(' ').slice(0, 2).join(' ')} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`${colorClasses.split(' ')[2]} font-medium`}>{title}</p>
            <p className={`${colorClasses.split(' ')[3]} text-sm`}>{message}</p>
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className={`${colorClasses.split(' ').slice(4).join(' ')} hover:text-white`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
