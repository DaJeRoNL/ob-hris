import { useMemo, useState } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function People() {
  const { currentClientId } = useAuth();
  const [filterLoc, setFilterLoc] = useState('');

  const people = useMemo(() => {
    return MOCK_DB.people.filter(p => 
      p.clientId === currentClientId && 
      (filterLoc ? p.loc === filterLoc : true)
    );
  }, [currentClientId, filterLoc]);

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Montserrat']">People Directory</h1>
          <p className="text-sm opacity-70">Manage your workforce</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="pl-9 pr-4 py-2 rounded-xl input-glass w-64" 
              placeholder="Search employees..." 
            />
          </div>
          <select 
            className="input-glass py-2 px-4 rounded-xl"
            onChange={(e) => setFilterLoc(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Philippines">Philippines</option>
          </select>
        </div>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Employee</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Role</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Location</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Status</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Visa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {people.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                    {p.name[0]}
                  </div>
                  <span className="font-semibold text-sm">{p.name}</span>
                </td>
                <td className="p-4 text-sm opacity-80">{p.role}</td>
                <td className="p-4 text-sm font-medium">{p.loc}</td>
                <td className="p-4">
                  <span className={`pill ${p.status === 'Active' ? 'pill-green' : 'pill-yellow'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-xs opacity-70">{p.visa}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {people.length === 0 && <div className="p-8 text-center opacity-50">No employees found.</div>}
      </div>
    </div>
  );
}