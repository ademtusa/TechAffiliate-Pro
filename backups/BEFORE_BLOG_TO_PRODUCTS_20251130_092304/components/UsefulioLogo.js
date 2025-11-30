'use client'

export default function UsefulioLogo({ className = "h-8 w-8" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon Background */}
      <path 
        d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z" 
        fill="url(#gradient1)"
        className="transition-all duration-300"
      />
      
      {/* Check Mark */}
      <path 
        d="M35 50 L45 60 L65 35" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
