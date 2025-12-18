import { useMemo, useState } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { MagnifyingGlass, Funnel, SquaresFour, List, EnvelopeSimple, Phone, MapPin, GlobeHemisphereWest, CaretRight } from '@phosphor-icons/react';

export default function People() {
  const { currentClientId } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterLoc, setFilterLoc] = useState('');
  const [search, setSearch] = useState('');

  const people = useMemo(() => {
    return MOCK_DB.people.filter(p => 
      p.clientId === currentClientId && 
      (filterLoc ? p.loc === filterLoc : true) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()))
    );
  }, [currentClientId, filterLoc, search]);

  return (
    <div className="p-8 text-[var(--text-main)] animate-fade-in h-full flex flex-col">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight mb-2">People Directory</h1>
          <p className="text-sm opacity-70 font-medium max-w-md">Access employee profiles, manage roles, and view global distribution.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-1 sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" weight="bold" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface)]/500 dark:bg-black/20 border border-gray-200 dark:border-white/10 backdrop-blur-sm focus:bg-white dark:focus:bg-[var(--color-surface)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" 
              placeholder="Search by name or role..." 
            />
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            <select 
              className="bg-[var(--color-surface)]/500 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              onChange={(e) => setFilterLoc(e.target.value)}
            >
              <option value="">Global (All)</option>
              <option value="USA">USA Office</option>
              <option value="UK">UK Branch</option>
              <option value="Philippines">Remote (PH)</option>
            </select>
            
            <div className="flex bg-[var(--color-surface)]/500 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}><SquaresFour weight="fill" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}><List weight="bold" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8 custom-scrollbar">
            {people.map(p => (
                <div key={p.id} className="glass-card group relative overflow-hidden hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                    <div className="relative p-6 pt-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] p-1 shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                                {p.name.charAt(0)}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                        <p className="text-sm opacity-60 mb-4">{p.role}</p>
                        
                        <div className="flex gap-2 mb-6">
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-[var(--color-surface)]/50 hover:bg-indigo-500 hover:text-white transition"><EnvelopeSimple weight="bold" /></button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-[var(--color-surface)]/50 hover:bg-emerald-500 hover:text-white transition"><Phone weight="bold" /></button>
                        </div>

                        <div className="w-full border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between items-center text-xs font-bold opacity-70">
                            <span className="flex items-center gap-1"><MapPin className="text-indigo-500" weight="fill" /> {p.loc}</span>
                            <span className={`px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{p.status}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-card !p-0 overflow-hidden flex-1">
            <div className="overflow-y-auto h-full custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-[var(--color-surface)]/50 sticky top-0 backdrop-blur-md z-10">
                        <tr className="text-xs font-bold uppercase opacity-50 border-b border-gray-200 dark:border-white/10">
                            <th className="p-4 pl-6">Employee</th>
                            <th className="p-4">Role & Dept</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                        {people.map(p => (
                            <tr key={p.id} className="group hover:bg-indigo-50/30 dark:hover:bg-[var(--color-surface)]/50 transition-colors">
                                <td className="p-4 pl-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-bold">{p.name}</span>
                                </td>
                                <td className="p-4 opacity-80">{p.role}</td>
                                <td className="p-4 flex items-center gap-2"><GlobeHemisphereWest size={16} className="opacity-40" /> {p.loc}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-indigo-500 hover:text-indigo-600 font-bold text-xs flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Profile <CaretRight weight="bold" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}