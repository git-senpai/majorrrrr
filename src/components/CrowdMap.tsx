import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zone, CrowdLevel } from '../types';

interface CrowdMapProps {
  zones: Zone[];
  onZoneClick: (zone: Zone) => void;
  selectedZoneId?: string;
}

const getCrowdColor = (level: CrowdLevel) => {
  switch (level) {
    case 'low': return '#22c55e'; // Green-500
    case 'medium': return '#eab308'; // Yellow-500
    case 'high': return '#f97316'; // Orange-500
    case 'very_high': return '#ef4444'; // Red-500
    case 'overcrowded': return '#991b1b'; // Red-800
    case 'closed': return '#4b5563'; // Gray-600
    default: return '#94a3b8'; // Slate-400
  }
};

export const CrowdMap: React.FC<CrowdMapProps> = ({ zones, onZoneClick, selectedZoneId }) => {
  const [hoveredZone, setHoveredZone] = React.useState<Zone | null>(null);

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
      {/* Schematic Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredZone && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute z-[60] pointer-events-none p-3 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl min-w-[140px]"
            style={{
              left: `${hoveredZone.x}%`,
              top: `${hoveredZone.y}%`,
              transform: 'translate(-50%, calc(-100% - 20px))' // Position above node
            }}
          >
            <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
              Active Monitoring
            </div>
            <div className="font-bold text-xs text-white leading-tight mb-2">
              {hoveredZone.name}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCrowdColor(hoveredZone.crowd) }} />
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: getCrowdColor(hoveredZone.crowd) }}>
                {hoveredZone.crowd.replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg className="w-full h-full p-8" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Connection Lines (Schematic) */}
        {zones.map((zone, i) => {
          const nextZone = zones[(i + 1) % zones.length];
          return (
            <motion.line
              key={`line-${zone.id}-${nextZone.id}`}
              x1={zone.x}
              y1={zone.y}
              x2={nextZone.x}
              y2={nextZone.y}
              stroke="white"
              strokeWidth="0.2"
              strokeDasharray="1 1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.15, pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}

        {/* Zones */}
        <AnimatePresence>
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const isHovered = hoveredZone?.id === zone.id;
            const color = getCrowdColor(zone.crowd);
            
            return (
              <motion.g
                key={zone.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onZoneClick(zone)}
                className="cursor-pointer"
              >
                {/* Glow Effect */}
                <motion.circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isHovered ? "6" : "4"}
                  fill={color}
                  initial={{ opacity: 0.1 }}
                  animate={{ opacity: isHovered ? 0.4 : [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Main Node */}
                <motion.circle
                  cx={zone.x}
                  cy={zone.y}
                  r={isSelected ? 3 : 2.5}
                  fill={color}
                  stroke="white"
                  strokeWidth={isSelected || isHovered ? "0.5" : "0"}
                  className="transition-all duration-300"
                />
                
                {/* Label */}
                <text
                  x={zone.x}
                  y={zone.y + 6}
                  textAnchor="middle"
                  fill="white"
                  fontSize="2.5"
                  className="font-mono uppercase tracking-widest opacity-70 pointer-events-none select-none transition-opacity"
                  style={{ opacity: isHovered ? 1 : 0.7 }}
                >
                  {zone.name}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10">
        {(['low', 'medium', 'high', 'very_high'] as CrowdLevel[]).map((lvl) => (
          <div key={lvl} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCrowdColor(lvl) }} />
            <span className="text-[10px] font-mono uppercase text-neutral-400">{lvl.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
