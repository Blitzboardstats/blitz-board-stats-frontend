
import React, { useState } from 'react';

interface BlitzLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const BlitzLogo: React.FC<BlitzLogoProps> = ({ size = "medium", className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClass = {
    small: "w-10 h-10",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  };

  const sizeStyle = {
    small: { width: '2.5rem', height: '2.5rem' },
    medium: { width: '5rem', height: '5rem' },
    large: { width: '8rem', height: '8rem' },
  };

  console.log('BlitzLogo: Rendering logo with size:', size, 'error state:', imageError);

  // Fallback component if image fails to load
  if (imageError) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div 
          className={`${sizeClass[size]} bg-blitz-purple rounded-full flex items-center justify-center`}
          style={{
            ...sizeStyle[size],
            backgroundColor: '#8B5CF6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span 
            className="text-white font-bold text-lg"
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            BB
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <img 
        src="/lovable-uploads/8225b3cc-b640-4df3-9fdc-581d216e165b.png" 
        alt="Blitz Board Stats Logo" 
        className={`${sizeClass[size]} object-contain`}
        style={sizeStyle[size]}
        onError={(e) => {
          console.error('BlitzLogo: Failed to load image, using fallback');
          setImageError(true);
        }}
        onLoad={() => {
          console.log('BlitzLogo: Image loaded successfully');
        }}
      />
    </div>
  );
};

export default BlitzLogo;
