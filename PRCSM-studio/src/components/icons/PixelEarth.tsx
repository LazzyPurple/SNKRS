import React from 'react';

interface PixelEarthProps {
  size?: number;
  className?: string;
}

export default function PixelEarth({ size = 120, className = '' }: PixelEarthProps) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Ocean base */}
        <circle cx="32" cy="32" r="30" fill="#4A90E2" />
        
        {/* Continents - simplified pixelated style */}
        {/* North America */}
        <rect x="8" y="16" width="4" height="4" fill="#90EE90" />
        <rect x="12" y="16" width="4" height="4" fill="#90EE90" />
        <rect x="8" y="20" width="8" height="4" fill="#90EE90" />
        <rect x="4" y="24" width="12" height="4" fill="#90EE90" />
        <rect x="8" y="28" width="8" height="4" fill="#90EE90" />
        
        {/* South America */}
        <rect x="16" y="32" width="4" height="4" fill="#90EE90" />
        <rect x="16" y="36" width="4" height="8" fill="#90EE90" />
        <rect x="12" y="40" width="4" height="4" fill="#90EE90" />
        
        {/* Europe */}
        <rect x="28" y="16" width="4" height="4" fill="#90EE90" />
        <rect x="32" y="16" width="4" height="4" fill="#90EE90" />
        <rect x="28" y="20" width="8" height="4" fill="#90EE90" />
        
        {/* Africa */}
        <rect x="32" y="24" width="4" height="4" fill="#90EE90" />
        <rect x="28" y="28" width="8" height="4" fill="#90EE90" />
        <rect x="32" y="32" width="4" height="8" fill="#90EE90" />
        <rect x="28" y="36" width="4" height="4" fill="#90EE90" />
        
        {/* Asia */}
        <rect x="40" y="12" width="8" height="4" fill="#90EE90" />
        <rect x="36" y="16" width="12" height="4" fill="#90EE90" />
        <rect x="40" y="20" width="8" height="4" fill="#90EE90" />
        <rect x="44" y="24" width="8" height="4" fill="#90EE90" />
        
        {/* Australia */}
        <rect x="48" y="40" width="8" height="4" fill="#90EE90" />
        
        {/* Some islands and details */}
        <rect x="20" y="12" width="4" height="4" fill="#90EE90" />
        <rect x="52" y="32" width="4" height="4" fill="#90EE90" />
        <rect x="56" y="28" width="4" height="4" fill="#90EE90" />
        
        {/* Clouds/atmosphere effect */}
        <rect x="12" y="8" width="4" height="4" fill="#E6E6FA" opacity="0.7" />
        <rect x="40" y="8" width="4" height="4" fill="#E6E6FA" opacity="0.7" />
        <rect x="8" y="48" width="4" height="4" fill="#E6E6FA" opacity="0.7" />
        <rect x="48" y="52" width="4" height="4" fill="#E6E6FA" opacity="0.7" />
        
        {/* Polar ice caps */}
        <rect x="28" y="4" width="8" height="4" fill="#F0F8FF" />
        <rect x="24" y="8" width="16" height="4" fill="#F0F8FF" />
        <rect x="28" y="56" width="8" height="4" fill="#F0F8FF" />
        <rect x="24" y="52" width="16" height="4" fill="#F0F8FF" />
      </svg>
    </div>
  );
}