import { useMemo } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { TrendUp, TrendDown, CurrencyDollar, FileText, DownloadSimple, Wallet, CreditCard, Bank } from '@phosphor-icons/react';

export default function Finance() {
  const { currentClientId } = useAuth();
  
  const records = useMemo(() => MOCK_DB.finance.filter(f => f.clientId === currentClientId), [currentClientId]);
  const totalRevenue = records.reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")) || 0), 0);

  // Mock Graph Data
  const chartHeight = [40, 65, 45, 80, 55, 90, 75, 100, 85, 60, 70, 95];

  return (
    <div className="p-8 text-[var(--color-text)] animate-fade-in h-full flex flex-col overflow-hidden">
      <header className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight flex items-center gap-2">
            Financial Overview
          </h1>
          <p className="text-sm opacity-60 mt-1 font-medium text-[var(--color-text-muted)]">Real-time cash flow analysis & invoice management.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-xl font-bold text-xs hover:bg-[var(--color-surface)] transition text-[var(--color-text)]">Export CSV</button>
            <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold text-xs hover:bg-[var(--color-primary-hover)] transition shadow-lg shadow-[var(--color-primary)]/20">New Invoice</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 shrink-0">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 glass-card bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="text-xs font-bold uppercase opacity-50 mb-1 tracking-widest text-white">Total Balance (USD)</div>
                    <div className="text-5xl font-black font-['Montserrat'] tracking-tight mb-4">${(totalRevenue * 1.25).toLocaleString()}</div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="bg-[var(--color-success)]/20 text-[var(--color-success)] px-2 py-0.5 rounded flex items-center gap-1 font-bold border border-[var(--color-success)]/30">
                            <TrendUp weight="bold" /> +12.4%
                        </span>
                        <span className="opacity-60 text-white">vs last month</span>
                    </div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                    <CurrencyDollar size={32} className="text-white" weight="duotone" />
                </div>
            </div>
            
            {/* Chart */}
            <div className="mt-8 flex items-end justify-between h-24 gap-2 opacity-80">
                {chartHeight.map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-white/30 to-transparent rounded-t-sm relative group/bar hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/50 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions / Cards */}
        <div className="flex flex-col gap-4">
            <div className="flex-1 glass-card p-5 flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition cursor-pointer group bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-info)]/10 text-[var(--color-info)] flex items-center justify-center group-hover:scale-110 transition-transform"><Wallet weight="duotone" size={24} /></div>
                <div>
                    <div className="font-bold text-lg text-[var(--color-text)]">$14,200</div>
                    <div className="text-xs opacity-60 text-[var(--color-text-muted)]">Pending Payouts</div>
                </div>
            </div>
            <div className="flex-1 glass-card p-5 flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition cursor-pointer group bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform"><CreditCard weight="duotone" size={24} /></div>
                <div>
                    <div className="font-bold text-lg text-[var(--color-text)]">**** 4291</div>
                    <div className="text-xs opacity-60 text-[var(--color-text-muted)]">Corporate Card</div>
                </div>
            </div>
            <div className="flex-1 glass-card p-5 flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition cursor-pointer group bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center group-hover:scale-110 transition-transform"><Bank weight="duotone" size={24} /></div>
                <div>
                    <div className="font-bold text-lg text-[var(--color-text)]">Healthy</div>
                    <div className="text-xs opacity-60 text-[var(--color-text-muted)]">Runway Status</div>
                </div>
            </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="glass-card flex-1 overflow-hidden flex flex-col p-0 bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg)]/50">
            <h3 className="font-bold flex items-center gap-2 text-[var(--color-text)]"><FileText className="text-[var(--color-primary)]" size={20} weight="duotone" /> Recent Transactions</h3>
            <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All</button>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[var(--color-surface)] text-xs font-bold uppercase opacity-50 z-10 shadow-sm text-[var(--color-text)]">
                <tr>
                  <th className="p-4">Transaction</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Status</th>
                  <th className="p-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-sm text-[var(--color-text)]">
                {records.map((r, i) => (
                  <tr key={r.id} className="group hover:bg-[var(--color-primary)]/5 transition-colors">
                    <td className="p-4 font-bold font-mono text-xs opacity-70">{r.id}</td>
                    <td className="p-4 font-medium">{r.entity}</td>
                    <td className="p-4 opacity-60 text-xs">{r.date}</td>
                    <td className="p-4 font-bold font-mono">{r.amount}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          r.status === 'Paid' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' : 
                          r.status === 'Pending' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20' : 
                          'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                        <button className="opacity-30 group-hover:opacity-100 hover:text-[var(--color-primary)] transition"><DownloadSimple size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}