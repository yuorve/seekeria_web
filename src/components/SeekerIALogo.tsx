/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * High-fidelity vector rendition of the official SeekerIA mascot & logo:
 * Friendly robotic explorer with safari hat, magnifying glass, location pins,
 * and background globe.
 */
export default function SeekerIALogo({
  className = '',
  size = 40,
  showWordmark = false,
  wordmarkClassName = 'text-white font-bold text-lg tracking-tight',
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-label="SeekerIA Mascot Logo"
      >
        <defs>
          <clipPath id="circleClip">
            <circle cx="100" cy="100" r="94" />
          </clipPath>
          <linearGradient id="globeGrad" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="hatGrad" x1="70" y1="20" x2="130" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde047" />
            <stop offset="0.6" stopColor="#eab308" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="robotBlueGrad" x1="60" y1="80" x2="140" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.6" stopColor="#0284c7" />
            <stop offset="1" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="glassLensGrad" x1="55" y1="50" x2="95" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0f2fe" stopOpacity="0.85" />
            <stop offset="1" stopColor="#bae6fd" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Outer circular badge frame */}
        <circle cx="100" cy="100" r="95" fill="#f0f9ff" stroke="#0284c7" strokeWidth="4" />

        {/* Clipped Globe Background */}
        <g clipPath="url(#circleClip)">
          {/* Globe Ocean */}
          <circle cx="100" cy="100" r="93" fill="url(#globeGrad)" opacity="0.65" />

          {/* Globe Continents (Green shapes) */}
          <path
            d="M30 60 Q50 45 80 50 Q110 55 100 80 Q90 105 60 110 Q35 110 30 85 Z"
            fill="#4ade80"
            opacity="0.9"
          />
          <path
            d="M120 40 Q150 45 170 70 Q165 95 140 100 Q125 90 120 70 Z"
            fill="#4ade80"
            opacity="0.9"
          />
          <path
            d="M40 130 Q70 120 85 145 Q80 170 50 175 Q30 160 40 130 Z"
            fill="#4ade80"
            opacity="0.85"
          />
          <path
            d="M110 135 Q145 125 165 150 Q155 175 125 170 Z"
            fill="#4ade80"
            opacity="0.85"
          />

          {/* Latitude & Longitude grid lines */}
          <ellipse cx="100" cy="100" rx="90" ry="36" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="48" ry="92" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
          <line x1="8" y1="100" x2="192" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Top Left Red Map Pin on Globe */}
        <g transform="translate(42, 38)">
          <path
            d="M0 -18 C-9 -18 -16 -11 -16 -2 C-16 8 -2 18 0 22 C2 18 16 8 16 -2 C16 -11 9 -18 0 -18 Z"
            fill="#ef4444"
            stroke="#1e293b"
            strokeWidth="3"
          />
          <circle cx="0" cy="-2" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
        </g>

        {/* Mascot Robot Group */}
        <g>
          {/* Backpack (brown straps and back pouch) */}
          <path
            d="M60 110 Q50 125 55 145 Q70 160 78 150 L75 120 Z"
            fill="#92400e"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          <path
            d="M140 110 Q150 125 145 145 Q130 160 122 150 L125 120 Z"
            fill="#92400e"
            stroke="#1e293b"
            strokeWidth="3.5"
          />

          {/* Blue Robot Body Lower */}
          <path
            d="M68 122 Q65 162 100 166 Q135 162 132 122 Z"
            fill="url(#robotBlueGrad)"
            stroke="#1e293b"
            strokeWidth="4"
          />

          {/* White Chest Shield */}
          <path
            d="M78 122 Q76 150 100 154 Q124 150 122 122 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3"
          />

          {/* Red Map Pin Emblem on Chest */}
          <g transform="translate(100, 137)">
            <path
              d="M0 -11 C-5 -11 -9 -7 -9 -2 C-9 4 -1 10 0 12 C1 10 9 4 9 -2 C9 -7 5 -11 0 -11 Z"
              fill="#ef4444"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <circle cx="0" cy="-2" r="3.2" fill="#ffffff" />
          </g>

          {/* Left Arm (Holding magnifying glass) */}
          <path
            d="M70 118 Q50 120 48 105 Q46 95 62 92"
            fill="url(#robotBlueGrad)"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Left hand gripping */}
          <circle cx="60" cy="94" r="8" fill="url(#robotBlueGrad)" stroke="#1e293b" strokeWidth="3.5" />

          {/* Right Arm */}
          <path
            d="M130 118 Q148 126 146 142 Q140 150 134 146"
            fill="url(#robotBlueGrad)"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="138" cy="144" r="7" fill="url(#robotBlueGrad)" stroke="#1e293b" strokeWidth="3" />

          {/* Blue Headphones / Ear Joints */}
          <ellipse cx="64" cy="84" rx="9" ry="14" fill="url(#robotBlueGrad)" stroke="#1e293b" strokeWidth="4" />
          <ellipse cx="136" cy="84" rx="9" ry="14" fill="url(#robotBlueGrad)" stroke="#1e293b" strokeWidth="4" />

          {/* Robot Head (White face, rounded) */}
          <rect
            x="66"
            y="62"
            width="68"
            height="52"
            rx="24"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="4.5"
          />

          {/* Cheerful Robot Eyes */}
          {/* Left Eye */}
          <ellipse cx="86" cy="83" rx="7.5" ry="9" fill="#1e293b" />
          <circle cx="84" cy="79" r="3.2" fill="#ffffff" />
          <circle cx="88" cy="86" r="1.5" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="114" cy="83" rx="7.5" ry="9" fill="#1e293b" />
          <circle cx="112" cy="79" r="3.2" fill="#ffffff" />
          <circle cx="116" cy="86" r="1.5" fill="#ffffff" />

          {/* Sweet Robot Smile */}
          <path
            d="M92 94 Q100 102 108 94"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="78" cy="91" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6" />
          <ellipse cx="122" cy="91" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6" />

          {/* Yellow Safari / Explorer Hat */}
          {/* Hat Crown */}
          <path
            d="M72 65 C72 38 128 38 128 65 Z"
            fill="url(#hatGrad)"
            stroke="#1e293b"
            strokeWidth="4"
          />
          {/* Hat center ridge */}
          <path
            d="M100 39 Q100 52 100 65"
            stroke="#ca8a04"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Hat Brim */}
          <ellipse
            cx="100"
            cy="65"
            rx="38"
            ry="9"
            fill="url(#hatGrad)"
            stroke="#1e293b"
            strokeWidth="4"
          />

          {/* Antenna on Hat (Right side) */}
          <line x1="126" y1="52" x2="135" y2="34" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="136" cy="32" r="4.5" fill="#ef4444" stroke="#1e293b" strokeWidth="2.5" />

          {/* Magnifying Glass (angled over front-left eye) */}
          {/* Handle */}
          <line
            x1="52"
            y1="102"
            x2="66"
            y2="88"
            stroke="#78350f"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="52"
            y1="102"
            x2="66"
            y2="88"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="52"
            y1="102"
            x2="66"
            y2="88"
            stroke="#92400e"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Lens Rim & Glass */}
          <circle
            cx="76"
            cy="77"
            r="16"
            fill="url(#glassLensGrad)"
            stroke="#1e293b"
            strokeWidth="4"
          />
          {/* Glass specular reflection highlight */}
          <path
            d="M68 70 A12 12 0 0 1 82 66"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      </svg>

      {showWordmark && (
        <span className={wordmarkClassName}>
          Seeker<span className="text-emerald-400">IA</span>
        </span>
      )}
    </div>
  );
}
