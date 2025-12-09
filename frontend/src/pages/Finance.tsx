import { useMemo } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export default function Finance() {
  const { currentClientId } = useAuth();
  
  const records = useMemo(() => 
    MOCK_DB.finance.filter(f => f.clientId === currentClientId), 
  [currentClientId]);

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-['Montserrat']">Finance</h1>
        <p className="text-sm opacity-70">Invoices & Entities</p>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Invoice #</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Entity</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Date</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Amount</th>
              <th className="text-left p-4 text-xs font-bold uppercase opacity-60">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                <td className="p-4 font-mono text-sm font-bold opacity-80">{r.id}</td>
                <td className="p-4 text-sm">{r.entity}</td>
                <td className="p-4 text-sm opacity-70">{r.date}</td>
                <td className="p-4 font-bold">{r.amount}</td>
                <td className="p-4">
                  <span className={`pill ${r.status === 'Paid' ? 'pill-green' : r.status === 'Pending' ? 'pill-yellow' : 'pill-red'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}