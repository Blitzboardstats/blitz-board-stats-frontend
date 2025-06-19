
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UsersRound, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContextOptimized';

const BottomNav = () => {
  const location = useLocation();
  const { isCoach } = useAuth();

  const navItems = [
    {
      href: '/teams',
      icon: UsersRound,
      label: 'Teams',
      showFor: ['all']
    },
    {
      href: '/stats',
      icon: BarChart3,
      label: 'Stats',
      showFor: ['all']
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      showFor: ['all']
    }
  ];

  const filteredItems = navItems.filter(item => 
    item.showFor.includes('all') || 
    (isCoach && item.showFor.includes('coach'))
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-1 z-50 shadow-lg">
      <div className="flex justify-around items-center">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 transition-colors',
                isActive ? 'text-blitz-purple' : 'text-foreground hover:text-foreground/80'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn(
                'h-6 w-6',
                isActive ? 'text-blitz-purple' : 'text-foreground'
              )} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
