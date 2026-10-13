import React from 'react';
import magoLabsLogo from '../assets/mago-labs-logo.png';

interface MagoLabsLogoProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const MagoLabsLogo: React.FC<MagoLabsLogoProps> = ({ className = '', size = 'md' }) => (
  <img
    src={magoLabsLogo}
    alt="Mago Labs"
    width={612}
    height={180}
    className={`${size === 'sm' ? 'h-6' : 'h-7 sm:h-8'} w-auto select-none ${className}`}
  />
);
