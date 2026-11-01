import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  darkMode?: boolean;
}

export const StudyBuddyLogo: React.FC<LogoProps> = ({
  className = 'h-10',
  variant = 'full',
  darkMode = false,
}) => {
  // Brand color palette extracted directly from user's light & dark mode images:
  // Light mode: Deep Navy #0B2545, Vibrant Teal #00A896
  // Dark mode: Refined Silver-Grey #94A3B8, Luminous Cyan-Teal #2DD4BF
  const leftColor = darkMode ? '#94A3B8' : '#0B2545';
  const rightColor = darkMode ? '#2DD4BF' : '#00A896';
  const studyColor = darkMode ? '#94A3B8' : '#0B2545';
  const buddyColor = darkMode ? '#2DD4BF' : '#00A896';

  const iconSvg = (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto shrink-0 select-none"
      aria-label="Study Buddy Logo"
    >
      {/* LEFT PERSON: Head */}
      <circle cx="50" cy="24" r="11" fill={leftColor} />

      {/* RIGHT PERSON: Head */}
      <circle cx="110" cy="24" r="11" fill={rightColor} />

      {/* LEFT PERSON: Body curving into heart's left lobe */}
      <path
        d="M 50 40 
           C 30 40 22 55 24 72 
           C 26 84 46 95 80 106 
           C 72 90 56 82 48 70 
           C 42 60 48 50 58 50 
           C 66 50 72 58 76 68 
           C 72 52 64 40 50 40 Z"
        fill={leftColor}
      />

      {/* RIGHT PERSON: Body curving into heart's right lobe */}
      <path
        d="M 110 40 
           C 130 40 138 55 136 72 
           C 134 84 114 95 80 106 
           C 88 90 104 82 112 70 
           C 118 60 112 50 102 50 
           C 94 50 88 58 84 68 
           C 88 52 96 40 110 40 Z"
        fill={rightColor}
      />

      {/* OPEN BOOK: Left Pages */}
      <path
        d="M 80 108 
           C 54 96 26 94 8 102 
           L 16 86 
           C 34 80 58 84 80 98 Z"
        fill={leftColor}
      />

      {/* OPEN BOOK: Right Pages */}
      <path
        d="M 80 108 
           C 106 96 134 94 152 102 
           L 144 86 
           C 126 80 102 84 80 98 Z"
        fill={rightColor}
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{iconSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {iconSvg}
      <div className="flex items-baseline tracking-tight font-sans font-bold leading-none">
        <span
          style={{ color: studyColor }}
          className="text-2xl sm:text-3xl font-extrabold mr-1.5 transition-colors duration-200"
        >
          Study
        </span>
        <span
          style={{ color: buddyColor }}
          className="text-2xl sm:text-3xl font-extrabold transition-colors duration-200"
        >
          Buddy
        </span>
      </div>
    </div>
  );
};
