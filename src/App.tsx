/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Clock, 
  Map as MapIcon, 
  Activity, 
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { LocationData, Zone, CrowdLevel } from './types';
import { analyzeLocation } from './services/geminiService';
import { LocationSearch } from './components/LocationSearch';
import { CrowdMap } from './components/CrowdMap';

const getCrowdLabel = (level: CrowdLevel) => {
  return level.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getStatusMessage = (level: CrowdLevel) => {
  switch (level) {
    case 'low': return 'Quiet & Accessible';
    case 'medium': return 'Moderate Activity';
    case 'high': return 'High Occupancy';
    case 'very_high': return 'Heavily Congested';
    case 'overcrowded': return 'Critical: Avoid Area';
    case 'closed': return 'Restricted Access';
    default: return 'Monitoring...';
  }
};

export default function App() {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setSelectedZone(null);
    try {
      const result = await analyzeLocation(location, currentTime);
      setData(result);
    } catch (err) {
      setError('AI analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-bottom border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <Users className="text-black w-5 h-5" />
            </div>
            <h1 className="font-mono text-sm tracking-tighter uppercase font-bold flex items-center gap-2">
              CrowdWatcher
              <span className="hidden sm:inline opacity-30"> v1.0.4 AI-OS</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ACTIVE
            </div>
            <div className="flex items-center gap-2">
               <Clock className="w-3.5 h-3.5" />
               {currentTime}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[0.9]">
              Intelligence for <br/>
              <span className="text-neutral-500">Every Square Meter</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Real-time crowd predictive modeling and spatial analysis. Enter any location to begin telemetry synchronization.
            </p>
            <LocationSearch onSearch={handleSearch} isLoading={loading} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3 text-sm mb-12"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {data && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                        <MapIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{data.location}</h3>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{data.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CrowdMap 
                    zones={data.zones} 
                    onZoneClick={(zone) => setSelectedZone(zone)}
                    selectedZoneId={selectedZone?.id}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard 
                      icon={Activity} 
                      label="Scanning Stat" 
                      value="Active" 
                      color="text-green-500"
                    />
                    <StatCard 
                      icon={TrendingUp} 
                      label="Capacity" 
                      value={`${Math.floor(Math.random() * 40 + 60)}%`} 
                    />
                    <StatCard 
                      icon={TrendingDown} 
                      label="Risk Index" 
                      value="Low-Mid" 
                    />
                    <StatCard 
                      icon={Info} 
                      label="Data Fidelity" 
                      value="94%" 
                    />
                  </div>
                </div>

                {/* Sidebar / Analysis Section */}
                <div className="space-y-6">
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4 flex items-center gap-2">
                       <Activity className="w-3 h-3" />
                       Intelligence Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-300 italic mb-6">
                      "{data.summary}"
                    </p>
                    
                    <div className="space-y-4">
                      {data.zones.map((zone) => (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${
                            selectedZone?.id === zone.id 
                            ? 'bg-white text-black border-white' 
                            : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{zone.name}</span>
                            <span className={`text-[10px] font-bold uppercase ${selectedZone?.id === zone.id ? 'text-black opacity-60' : 'text-neutral-500'}`}>
                              {zone.crowd}
                            </span>
                          </div>
                          <div className="mt-1 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: getCrowdPercent(zone.crowd) }}
                              className={`h-full ${selectedZone?.id === zone.id ? 'bg-black' : getCrowdBg(zone.crowd)}`}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Zone Detail */}
                  <AnimatePresence mode="wait">
                    {selectedZone ? (
                      <motion.div
                        key={selectedZone.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h5 className="font-bold text-lg mb-1">{selectedZone.name}</h5>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getCrowdBg(selectedZone.crowd)} text-white`}>
                                {getCrowdLabel(selectedZone.crowd)}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setSelectedZone(null)}
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                          </button>
                        </div>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                          {selectedZone.description || 'Current observational data indicates periodic fluctuations in density and movement patterns within this zone.'}
                        </p>
                        <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-4">
                          <div className="p-2 bg-neutral-800 rounded-lg">
                            <AlertTriangle className={`w-5 h-5 ${selectedZone.crowd === 'high' || selectedZone.crowd === 'very_high' ? 'text-orange-500' : 'text-neutral-500'}`} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-mono text-neutral-500">Advisory</p>
                            <p className="text-xs font-medium">{getStatusMessage(selectedZone.crowd)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-48 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-600 gap-3">
                         <MapIcon className="w-6 h-6 opacity-20" />
                         <p className="text-xs font-mono uppercase tracking-widest">Select a zone for analysis</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 bg-black/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-600 text-xs font-mono uppercase tracking-[0.2em]">
            © 2026 CrowdWatcher Spatial Intelligence
          </div>
          <div className="flex gap-6">
            <FooterLink label="Telemetry" />
            <FooterLink label="Architecture" />
            <FooterLink label="Privacy" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-white" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-neutral-600 hover:text-neutral-100 text-xs font-mono uppercase tracking-widest transition-colors">
      {label}
    </a>
  );
}

function getCrowdBg(level: CrowdLevel) {
  switch (level) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-orange-500';
    case 'very_high': return 'bg-red-500';
    case 'overcrowded': return 'bg-red-800';
    case 'closed': return 'bg-neutral-600';
    default: return 'bg-neutral-500';
  }
}

function getCrowdPercent(level: CrowdLevel) {
  switch (level) {
    case 'low': return '20%';
    case 'medium': return '50%';
    case 'high': return '75%';
    case 'very_high': return '90%';
    case 'overcrowded': return '100%';
    case 'closed': return '0%';
    default: return '10%';
  }
}
