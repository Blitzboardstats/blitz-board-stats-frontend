
import React from 'react';
import BlitzLogo from './BlitzLogo';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showLogo = true, children }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      {showLogo && <BlitzLogo size="small" className="mb-2" />}
      {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
      {children}
    </div>
  );
};

export default Header;
