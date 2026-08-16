import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const NagpurTrafficPoliceEmblem: React.FC<EmblemProps> = ({ 
  className = '', 
  size = 32 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`shrink-0 select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Top curved path for English text */}
        <path
          id="topTextPath"
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
        />
        {/* Bottom curved path for Marathi text */}
        <path
          id="bottomTextPath"
          d="M 172 100 A 72 72 0 0 1 28 100"
          fill="none"
        />
      </defs>

      {/* Outer Golden/Yellow Ring */}
      <circle cx="100" cy="100" r="97" fill="#FFD700" stroke="#FFCC00" strokeWidth="2" />

      {/* Inner Red Field */}
      <circle cx="100" cy="100" r="91" fill="#E31820" />

      {/* Outer text: NAGPUR TRAFFIC POLICE */}
      <text
        fill="#FFFFFF"
        fontSize="13.5"
        fontWeight="800"
        fontFamily="'Arial Black', 'Poppins', sans-serif"
        letterSpacing="1.2"
      >
        <textPath
          href="#topTextPath"
          startOffset="50%"
          textAnchor="middle"
        >
          NAGPUR TRAFFIC POLICE
        </textPath>
      </text>

      {/* Left Star */}
      <polygon
        points="22,100 24.5,94 30.5,94 25.5,90.5 27.5,85 22,88.5 16.5,85 18.5,90.5 13.5,94 19.5,94"
        fill="#111111"
        transform="translate(0, 5)"
      />
      {/* Right Star */}
      <polygon
        points="178,100 180.5,94 186.5,94 181.5,90.5 183.5,85 178,88.5 172.5,85 174.5,90.5 169.5,94 175.5,94"
        fill="#111111"
        transform="translate(0, 5)"
      />

      {/* Bottom text: नागपूर वाहतूक पोलीस */}
      <text
        fill="#FFFFFF"
        fontSize="13.5"
        fontWeight="700"
        fontFamily="'Noto Sans', 'Poppins', sans-serif"
        letterSpacing="0.8"
      >
        <textPath
          href="#bottomTextPath"
          startOffset="50%"
          textAnchor="middle"
        >
          नागपूर वाहतूक पोलीस
        </textPath>
      </text>

      {/* Central White Ring */}
      <circle cx="100" cy="100" r="61" fill="#FFFFFF" />

      {/* Central Black Wheel Outer */}
      <circle cx="100" cy="100" r="56" fill="#111111" />

      {/* 8-Spoke Wheel (Chakra) in White */}
      <g stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round">
        <line x1="100" y1="44" x2="100" y2="156" />
        <line x1="44" y1="100" x2="156" y2="100" />
        <line x1="60.4" y1="60.4" x2="139.6" y2="139.6" />
        <line x1="60.4" y1="139.6" x2="139.6" y2="60.4" />
      </g>

      {/* Center hub */}
      <circle cx="100" cy="100" r="7" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="3.5" fill="#111111" />
    </svg>
  );
};
