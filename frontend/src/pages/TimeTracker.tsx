import { useState, useEffect } from 'react';

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: number | undefined; // NodeJS.Timeout or number
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Logic to save would go here
      console.log("Shift saved:", formatTime(seconds));
      setSeconds(0);
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100">
      <header className="mb-6"><h1 className="text-2xl font-bold font-['Montserrat']">Time & Monitoring</h1></header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Timesheet</h3>
          <div className="text-center opacity-50 py-10">Calendar UI Placeholder</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <h3 className="font-bold opacity-80 flex justify-between">Live Tracker</h3>
            <div className="text-4xl font-bold mt-4 font-mono">{formatTime(seconds)}</div>
            <div className="text-sm opacity-60 mt-1">{isRunning ? 'Tracking Time...' : 'Ready to start'}</div>
            
            <button 
              onClick={toggleTimer}
              className={`w-full mt-6 py-3 rounded-xl text-sm font-semibold border transition backdrop-blur
                ${isRunning ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
            >
              {isRunning ? 'Stop & Save' : 'Clock In'}
            </button>
        </div>
      </div>
    </div>
  );
}