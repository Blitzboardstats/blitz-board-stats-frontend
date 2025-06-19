
import React from 'react';
import BlitzLogo from '@/components/BlitzLogo';
import PrivacyStatement from '@/components/privacy/PrivacyStatement';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <BlitzLogo size="large" className="mb-6" />
      
      <div className="w-full max-w-md text-center mb-8">
        <p className="text-foreground text-lg px-4">
          Blitz Board Stats is a youth and high school football app for team management, player stat tracking, and real-time communication.
        </p>
      </div>

      {children}

      <div className="mt-8 flex space-x-8">
        <a href="#" className="text-blitz-purple hover:text-blitz-purple/80 transition-colors font-medium">
          Forgot password?
        </a>
        <PrivacyStatement 
          trigger={
            <button className="text-blitz-purple hover:text-blitz-purple/80 transition-colors font-medium">
              Privacy
            </button>
          }
        />
      </div>
      
      <div className="mt-10 text-center text-muted-foreground">
        <p>Subscribe to Blitz Board Stats — where every play counts</p>
      </div>
    </div>
  );
};

export default AuthLayout;
