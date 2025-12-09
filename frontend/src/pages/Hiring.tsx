import { useMemo } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { Plus } from '@phosphor-icons/react';

export default function Hiring() {
  const { currentClientId } = useAuth();
  
  const candidates = useMemo(() => 
    MOCK_DB.hiring.filter(h => h.clientId === currentClientId), 
  [currentClientId]);

  const stages = ['Screening', 'Interview', 'Offer'];

  return (
    <div className="p-8 h-full flex flex-col text-gray-900 dark:text-gray-100 animate-fade-in">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-['Montserrat']">Talent Acquisition</h1>
          <p className="text-sm opacity-70">Pipeline Overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20">
          <Plus weight="bold" /> New Requisition
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {stages.map(stage => (
          <div key={stage} className="bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="font-bold text-xs uppercase opacity-60 tracking-wider">{stage}</h3>
              <span className="bg-gray-200 dark:bg-white/10 text-xs px-2 py-0.5 rounded-full font-mono">
                {candidates.filter(c => c.stage === stage).length}
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {candidates.filter(c => c.stage === stage).map(c => (
                <div key={c.id} className="glass-card p-4 rounded-xl border-l-4 border-l-indigo-500 hover:translate-y-[-2px] transition-transform cursor-pointer shadow-sm">
                  <div className="font-bold text-sm mb-1">{c.name}</div>
                  <div className="text-xs opacity-60">{c.role}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}