import { useMemo } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { IdentificationCard, Laptop } from '@phosphor-icons/react';

export default function Compliance() {
  const { currentClientId } = useAuth();
  const people = useMemo(() => MOCK_DB.people.filter(p => p.clientId === currentClientId), [currentClientId]);

  // Derived stats
  const remoteCount = people.filter(p => p.loc !== 'USA' && p.loc !== 'UK').length;
  const hybridCount = people.length - remoteCount;

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100 animate-fade-in space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-['Montserrat']">Global Compliance</h1>
        <p className="text-sm opacity-70">Workforce Distribution & Authorization</p>
      </header>

      {/* Map Container */}
      <div className="w-full aspect-[2/1] bg-[#1e1b4b] rounded-2xl overflow-hidden relative shadow-inner border border-white/10 group">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
          className="w-full h-full object-cover opacity-50 filter invert brightness-75 contrast-125 grayscale" 
          alt="World Map"
        />
        {/* Simple mock dots based on locations */}
        <div className="absolute top-[35%] left-[20%] w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_0_4px_rgba(96,165,250,0.3)] animate-pulse" title="USA"></div>
        <div className="absolute top-[22%] left-[49%] w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_0_4px_rgba(96,165,250,0.3)]" title="UK"></div>
        <div className="absolute top-[45%] left-[84%] w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_0_4px_rgba(96,165,250,0.3)]" title="Philippines"></div>
        
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono border border-white/10">
          Global Presence: Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <IdentificationCard size={20} className="text-indigo-500" /> Visa Status
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {people.map(p => (
                <tr key={p.id}>
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 opacity-70">{p.visa}</td>
                  <td className="py-2 text-right">
                    <span className={`pill ${p.visa === 'Citizen' ? 'pill-green' : 'pill-blue'}`}>
                      {p.visa === 'Citizen' ? 'Valid' : 'Check'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Laptop size={20} className="text-emerald-500" /> Remote Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
              <div className="text-2xl font-bold">{remoteCount}</div>
              <div className="text-xs opacity-60">Remote</div>
            </div>
            <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
              <div className="text-2xl font-bold">{hybridCount}</div>
              <div className="text-xs opacity-60">Hybrid</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold">Equipment Deployed</span>
              <span className="opacity-60">100%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}