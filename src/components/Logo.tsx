import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'white' | 'horizontal';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', subtitle: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', subtitle: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', subtitle: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl', subtitle: 'text-sm' },
  };

  const isWhite = variant === 'white';
  const navyColor = isWhite ? '#FFFFFF' : '#142C54';
  const orangeColor = '#E56B2F';
  const lightOrange = '#F4D8C7';
  const greenColor = '#2E6B4A';

  // SVG representation of the official MargRakshak logo
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size].icon} shrink-0 transition-transform duration-200`}
      aria-label="MargRakshak Logo"
    >
      {/* Top Finial / Kalash Sphere */}
      <circle cx="100" cy="38" r="4.5" fill={orangeColor} />
      
      {/* Dome Top Spire */}
      <path
        d="M98.5 42.5H101.5V47H98.5V42.5Z"
        fill={navyColor}
      />

      {/* Main Heritage Dome */}
      <path
        d="M74 69C74 53 85.5 46.5 100 46.5C114.5 46.5 126 53 126 69H74Z"
        fill={navyColor}
      />
      
      {/* Dome Base Arch Trim */}
      <path
        d="M68 68.5H132V72H68V68.5Z"
        fill={navyColor}
      />

      {/* Pavilion Structure & Arches */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60 74H140V77H133.5V110H127V88C127 80 119.5 78 113.5 83C107.5 88 106 88 100 88C94 88 92.5 83 86.5 83C80.5 78 73 80 73 88V110H66.5V77H60V74ZM79 110V90C79 84 84 83 87.5 86C91 89 94 92 100 92C106 92 109 89 112.5 86C116 83 121 84 121 90V110H113V94C113 90 109 89.5 106.5 91.5C104 93.5 101.5 94.5 100 94.5C98.5 94.5 96 93.5 93.5 91.5C91 89.5 87 90 87 94V110H79Z"
        fill={navyColor}
      />

      {/* Plinth Platform Base */}
      <path
        d="M58 110H142V113.5H58V110Z"
        fill={navyColor}
      />

      {/* Traffic Signal on Left */}
      <path d="M50 82H54V110H50V82Z" fill={navyColor} />
      <rect x="47" y="72" width="7" height="13" rx="1.5" fill={navyColor} />
      <circle cx="50.5" cy="76" r="1.8" fill="#B8332C" />
      <circle cx="50.5" cy="81.5" r="1.8" fill={greenColor} />

      {/* Police Officer on Right */}
      {/* Head with Police Cap */}
      <circle cx="152" cy="78" r="3.2" fill={navyColor} />
      <path d="M149 76.5C149 75 155 75 155 76.5H149Z" fill={navyColor} />
      {/* Officer Body */}
      <path
        d="M147 84C147 82.5 149 82 152 82C155 82 157 82.5 157 84L156.5 98H154.5L154.5 110H149.5L149.5 98H147.5L147 84Z"
        fill={navyColor}
      />
      {/* Radio/Handheld note */}
      <rect x="146.5" y="89" width="2" height="4" fill={lightOrange} />

      {/* Intelligent Network Graph Nodes at bottom */}
      {/* Lines */}
      <path
        d="M86 142L100 150L114 142M100 150L87 165L100 172L113 165L100 150M86 142L87 165M114 142L113 165"
        stroke={navyColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isWhite ? "0.8" : "0.5"}
      />
      {/* Node Dots */}
      <circle cx="86" cy="142" r="3.5" fill={orangeColor} />
      <circle cx="114" cy="142" r="3.5" fill={orangeColor} />
      <circle cx="100" cy="150" r="3.8" fill={orangeColor} />
      <circle cx="87" cy="165" r="3.5" fill={orangeColor} />
      <circle cx="113" cy="165" r="3.5" fill={orangeColor} />
      <circle cx="100" cy="172" r="4.2" fill={orangeColor} />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {LogoIcon}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight ${sizeMap[size].text}`}
              style={{ color: navyColor, fontFamily: "'Noto Sans', sans-serif" }}
            >
              Marg<span style={{ color: orangeColor }}>Rakshak</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E56B2F]/10 text-[#E56B2F] border border-[#E56B2F]/20">
              Nagpur
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`${sizeMap[size].subtitle} font-medium tracking-wide uppercase`}
              style={{ color: isWhite ? '#DCDCD6' : '#5E625F' }}
            >
              Traffic Risk & Police Deployment
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
      {LogoIcon}
      <span
        className={`font-bold tracking-tight mt-1 ${sizeMap[size].text}`}
        style={{ color: navyColor, fontFamily: "'Noto Sans', sans-serif" }}
      >
        Marg<span style={{ color: orangeColor }}>Rakshak</span>
      </span>
      {showSubtitle && (
        <span
          className={`${sizeMap[size].subtitle} font-medium tracking-wide uppercase mt-0.5`}
          style={{ color: isWhite ? '#DCDCD6' : '#5E625F' }}
        >
          Nagpur City Police Support
        </span>
      )}
    </div>
  );
};
