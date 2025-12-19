import { useMemo, useState } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { MagnifyingGlass, SquaresFour, List, EnvelopeSimple, Phone, MapPin, GlobeHemisphereWest, CaretRight } from '@phosphor-icons/react';

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
    <div className="p-8 text-[var(--color-text)] animate-fade-in h-full flex flex-col">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight mb-2 text-[var(--color-text)]">People Directory</h1>
          <p className="text-sm opacity-70 font-medium max-w-md text-[var(--color-text-muted)]">Access employee profiles, manage roles, and view global distribution.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group flex-1 sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" weight="bold" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] backdrop-blur-sm focus:bg-[var(--color-surface)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all shadow-sm text-[var(--color-text)]" 
              placeholder="Search by name or role..." 
            />
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            <select 
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer text-[var(--color-text)]"
              onChange={(e) => setFilterLoc(e.target.value)}
            >
              <option value="">Global (All)</option>
              <option value="USA">USA Office</option>
              <option value="UK">UK Branch</option>
              <option value="Philippines">Remote (PH)</option>
            </select>
            
            <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'opacity-50 hover:opacity-100 text-[var(--color-text)]'}`}><SquaresFour weight="fill" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'opacity-50 hover:opacity-100 text-[var(--color-text)]'}`}><List weight="bold" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8 custom-scrollbar">
            {people.map(p => (
                <div key={p.id} className="glass-card group relative overflow-hidden hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20"></div>
                    <div className="relative p-6 pt-12 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] p-1 shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-info)] flex items-center justify-center text-2xl font-bold text-white">
                                {p.name.charAt(0)}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1 text-[var(--color-text)]">{p.name}</h3>
                        <p className="text-sm opacity-60 mb-4 text-[var(--color-text)]">{p.role}</p>
                        
                        <div className="flex gap-2 mb-6">
                            <button className="p-2 rounded-full bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white transition text-[var(--color-text-muted)]"><EnvelopeSimple weight="bold" /></button>
                            <button className="p-2 rounded-full bg-[var(--color-bg)] hover:bg-[var(--color-success)] hover:text-white transition text-[var(--color-text-muted)]"><Phone weight="bold" /></button>
                        </div>

                        <div className="w-full border-t border-[var(--color-border)] pt-4 flex justify-between items-center text-xs font-bold opacity-70">
                            <span className="flex items-center gap-1 text-[var(--color-text)]"><MapPin className="text-[var(--color-primary)]" weight="fill" /> {p.loc}</span>
                            <span className={`px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'}`}>{p.status}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-card !p-0 overflow-hidden flex-1 bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="overflow-y-auto h-full custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--color-surface)] sticky top-0 backdrop-blur-md z-10">
                        <tr className="text-xs font-bold uppercase opacity-50 border-b border-[var(--color-border)] text-[var(--color-text)]">
                            <th className="p-4 pl-6">Employee</th>
                            <th className="p-4">Role & Dept</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                        {people.map(p => (
                            <tr key={p.id} className="group hover:bg-[var(--color-primary)]/5 transition-colors">
                                <td className="p-4 pl-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-bold text-[var(--color-text)]">{p.name}</span>
                                </td>
                                <td className="p-4 opacity-80 text-[var(--color-text)]">{p.role}</td>
                                <td className="p-4 flex items-center gap-2 text-[var(--color-text)]"><GlobeHemisphereWest size={16} className="opacity-40" /> {p.loc}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${p.status === 'Active' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20' : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold text-xs flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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