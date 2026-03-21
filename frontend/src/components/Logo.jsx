import React from 'react';

const Logo = ({ className = "w-[140px]" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex-shrink-0">
        {/* Overlapping brackets design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left bracket */}
            <path d="M18 10 L12 10 L12 30 L18 30" stroke="url(#gradient1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Right bracket */}
            <path d="M22 10 L28 10 L28 30 L22 30" stroke="url(#gradient2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Center fusion line */}
            <line x1="20" y1="15" x2="20" y2="25" stroke="url(#gradient3)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="2" fill="url(#gradient3)"/>
            
            <defs>
              <linearGradient id="gradient1" x1="12" y1="10" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="gradient2" x1="28" y1="10" x2="22" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="gradient3" x1="20" y1="15" x2="20" y2="25" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold text-primary">Easy<span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Code</span></span>

      </div>
    </div>
  );
};

export default Logo;
