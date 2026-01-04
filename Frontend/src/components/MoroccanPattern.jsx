// src/components/MoroccanPattern.jsx
import React from 'react';

const MoroccanPattern = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* 1. Define the Animation locally to ensure it works */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* 2. The Pattern Layer */}
      <div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.15]"
        style={{
          // A real "Rub el Hizb" (8-point star) geometric tile
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%2306b6d4' stroke-width='1' opacity='0.5'/%3E%3Cpath d='M15 15 L45 15 L45 45 L15 45 Z' fill='none' stroke='%233b82f6' stroke-width='1' opacity='0.8'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%2306b6d4' opacity='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          animation: 'spin-slow 120s linear infinite', // Slower, majestic rotation
        }}
      ></div>
      
      {/* 3. Gradient Overlay (Vignette) to focus on the center form */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
    </div>
  );
};

export default MoroccanPattern;