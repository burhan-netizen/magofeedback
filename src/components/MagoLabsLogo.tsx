import React from 'react';
import magoLabsLogo from '../assets/mago-labs-logo.png';

interface MagoLabsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const MagoLabsLogo: React.FC<MagoLabsLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const imgHeightClasses = {
    sm: 'h-8',
    md: 'h-[35px] sm:h-11',
    lg: 'h-14',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src={magoLabsLogo}
        alt="Mago Labs"
        className={`${imgHeightClasses[size]} w-auto shrink-0`}
      />
      {showSubtitle && (
        <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mt-1">
          Client Experience Portal
        </span>
      )}
    </div>
  );
};

