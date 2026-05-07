import { useState } from 'react';
import { LocationData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Send, Phone } from 'lucide-react';

export function DetailedAnalysis({ data }: { data: LocationData }) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean, message?: string } | null>(null);

  if (!data.detailedGraphs) {
    return <div className="p-4 text-center text-neutral-500">Detailed graphs data not available for this location.</div>;
  }

  const { timeLabels, crowdDensity, movementSpeed, riskFactor } = data.detailedGraphs;

  const chartData = timeLabels.map((time, index) => ({
    time,
    crowdDensity: crowdDensity[index] || 0,
    movementSpeed: movementSpeed[index] || 0,
    riskFactor: riskFactor[index] || 0,
  }));

  const handleSendWhatsApp = async () => {
    if (!phoneNumbers.trim()) {
      setSendResult({ success: false, message: 'Please enter at least one phone number.' });
      return;
    }

    const numbersList = phoneNumbers.split(',').map(n => n.trim()).filter(n => n.length > 0);

    setSending(true);
    setSendResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numbers: numbersList,
          message: `Alert from CROWD SOURCED MANAGEMENT SYSTEM!\nLocation: ${data.location}\nTime: ${data.time}\nCurrent Risk Level: ${data.summary}`
        })
      });
      const result = await response.json();
      if (response.ok) {
        const successes = result.results.filter((r: any) => r.status === 'success');
        const failures = result.results.filter((r: any) => r.status === 'failed');
        
        if (successes.length > 0 && failures.length === 0) {
          setSendResult({ success: true, message: `Sent successfully to ${successes.length} number(s).` });
          setPhoneNumbers('');
        } else if (failures.length > 0) {
          setSendResult({ success: false, message: `Failed: ${failures[0].error}` });
        } else {
          setSendResult({ success: false, message: 'Failed to send message.' });
        }
      } else {
        setSendResult({ success: false, message: result.error || 'Failed to send message.' });
      }
    } catch (error) {
      setSendResult({ success: false, message: 'Network error or server is down.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 mt-12 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
      <h3 className="text-2xl font-bold mb-6">Detailed Temporal Analysis</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graph 1: Crowd Density */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 h-80">
          <h4 className="text-sm font-mono text-neutral-400 mb-4 uppercase tracking-widest">Crowd Density Over Time</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
              <Area type="monotone" dataKey="crowdDensity" stroke="#ef4444" fillOpacity={1} fill="url(#colorDensity)" name="Density %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Movement Speed & Risk */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 h-80">
          <h4 className="text-sm font-mono text-neutral-400 mb-4 uppercase tracking-widest">Movement Speed vs Risk Factor</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
              <Legend />
              <Line type="monotone" dataKey="movementSpeed" stroke="#3b82f6" name="Speed %" strokeWidth={2} />
              <Line type="monotone" dataKey="riskFactor" stroke="#f59e0b" name="Risk Factor %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-black/40 p-6 rounded-xl border border-neutral-800 mt-8">
        <h4 className="text-lg font-bold flex items-center gap-2 mb-2">
          <Phone className="w-5 h-5 text-green-500" />
          Broadcast Alerts via WhatsApp
        </h4>
        <p className="text-sm text-neutral-400 mb-4">Send instant alerts to authorities or team members using Twilio API.</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter mobile numbers (comma separated, e.g. +919876543210)"
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neutral-500"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
          />
          <button
            onClick={handleSendWhatsApp}
            disabled={sending}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Alerts'}
          </button>
        </div>

        {sendResult && (
          <div className={`mt-4 text-sm ${sendResult.success ? 'text-green-500' : 'text-red-500'}`}>
            {sendResult.message}
          </div>
        )}
      </div>
    </div>
  );
}
