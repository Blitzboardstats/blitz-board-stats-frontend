
import React from 'react';
import { Link } from 'react-router-dom';
import BlitzLogo from '@/components/BlitzLogo';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <BlitzLogo size="medium" className="mb-8" />
      
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-6">Page not found</p>
      
      <Link to="/">
        <Button className="blitz-btn">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
