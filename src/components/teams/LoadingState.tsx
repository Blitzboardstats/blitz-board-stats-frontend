
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading your teams..." }: LoadingStateProps) => {
  return (
    <div className="flex justify-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple mx-auto mb-4"></div>
        <p className="text-black">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
