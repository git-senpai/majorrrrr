import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Radio, AlertTriangle } from 'lucide-react';
import { LocationData, Zone } from '../types';

interface LiveFeedProps {
  data: LocationData;
}

interface FeedEvent {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'warning';
}

const EVENT_TEMPLATES = [
  "Minor density fluctuation detected near {zone}",
  "Pedestrian flow stabilizing at {zone}",
  "Thermal sensors indicate gathering at {zone}",
  "Movement pattern anomaly observed near {zone}",
  "Throughput optimal around {zone}"
];

const WARNING_TEMPLATES = [
  "Congestion building rapidly at {zone}",
  "Bottleneck forming near {zone}",
  "Capacity threshold approaching at {zone}"
];

export const LiveFeed: React.FC<LiveFeedProps> = ({ data }) => {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Initial event
    setEvents([{
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: `Telemetry link established for ${data.location}`,
      type: 'info'
    }]);

    const interval = setInterval(() => {
      if (!data.zones || data.zones.length === 0) return;
      
      const isWarning = Math.random() > 0.8;
      const templates = isWarning ? WARNING_TEMPLATES : EVENT_TEMPLATES;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const randomZone = data.zones[Math.floor(Math.random() * data.zones.length)].name;
      
      const newEvent: FeedEvent = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: template.replace('{zone}', randomZone),
        type: isWarning ? 'warning' : 'info'
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 5)); // Keep last 5 events
    }, 4000 + Math.random() * 4000); // Random interval between 4-8s

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-[320px] border border-neutral-800 bg-neutral-900/30 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
           <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
           Live Telemetry Feed
        </h4>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative min-h-[200px]">
        <div className="absolute top-0 left-[3px] w-px h-full bg-neutral-800/50" />
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative pl-6 pb-4"
            >
              <div className={`absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full ring-4 ring-[#0a0a0a] ${event.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-neutral-500">{event.time}</span>
                {event.type === 'warning' && <AlertTriangle className="w-3 h-3 text-orange-500" />}
              </div>
              <p className={`text-xs ${event.type === 'warning' ? 'text-orange-200' : 'text-neutral-300'}`}>
                {event.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
