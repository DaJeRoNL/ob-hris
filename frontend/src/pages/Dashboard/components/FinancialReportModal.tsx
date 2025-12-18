import { X, FilePdf, DownloadSimple, Printer, Sparkle, TrendUp, WarningCircle, CheckCircle } from '@phosphor-icons/react';

interface Props {
    onClose: () => void;
}

export default function FinancialReportModal({ onClose }: Props) {
    const timestamp = new Date().toLocaleString();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-[var(--color-surface)] w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Toolbar */}
                <div className="bg-gray-100 dark:bg-[var(--color-surface)] p-4 flex justify-between items-center border-b border-gray-200 dark:border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 text-white p-2 rounded shadow-sm">
                            <Sparkle size={20} weight="fill" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-[var(--text-main)]">AI_Financial_Analysis_Q4.pdf</h3>
                            <p className="text-[10px] opacity-60">Generated: {timestamp}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition shadow-lg">
                            <DownloadSimple size={16} /> Export
                        </button>
                        <button onClick={onClose} className="ml-2 p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition text-[var(--text-main)]"><X size={20} /></button>
                    </div>
                </div>

                {/* PDF Content Mockup */}
                <div className="flex-1 bg-gray-200  overflow-y-auto p-8 flex flex-col items-center gap-8 custom-scrollbar">
                    
                    {/* PAGE 1 */}
                    <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-16 text-black flex flex-col gap-8 relative shrink-0">
                        {/* Report Header */}
                        <div className="border-b-4 border-emerald-900 pb-8 mb-4 flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-bold font-serif mb-2 text-[var(--color-text)]">Financial Trend Report</h1>
                                <p className="text-sm uppercase tracking-widest text-emerald-600 font-bold">Automated Intelligence • OB-HRIS</p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black text-slate-200 tracking-tighter">Q4</div>
                                <div className="text-xs font-bold uppercase text-slate-400 mt-1">FY 2024</div>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold border-b border-slate-200 pb-2 text-slate-800 uppercase tracking-wider">1. Executive Summary</h3>
                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-lg text-sm leading-relaxed text-slate-700 text-justify">
                                <p className="mb-3">
                                    <strong>Trend Analysis:</strong> The company exhibits a <span className="text-emerald-700 font-bold">Strong Bullish</span> trend over the last 7 days. Revenue retention remains high at 98%. Payroll volatility has stabilized following the Q3 hiring surge.
                                </p>
                                <p>
                                    <strong>AI Recommendation:</strong> Based on current burn rate and cash flow velocity, it is recommended to increase the hiring budget for Engineering roles by 15% to capitalize on market momentum.
                                </p>
                            </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="text-xs font-bold uppercase text-slate-400 mb-1">Burn Rate (MoM)</div>
                                <div className="text-2xl font-bold text-slate-800">$42.5k</div>
                                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1"><TrendUp weight="bold" /> +2.4% vs Prev</div>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="text-xs font-bold uppercase text-slate-400 mb-1">Est. Runway</div>
                                <div className="text-2xl font-bold text-slate-800">18 Mo</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-1">Based on current cash</div>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="text-xs font-bold uppercase text-slate-400 mb-1">Operating Margin</div>
                                <div className="text-2xl font-bold text-slate-800">22%</div>
                                <div className="text-[10px] text-emerald-600 font-bold mt-1">Healthy</div>
                            </div>
                        </div>

                        {/* Anomaly Detection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold border-b border-slate-200 pb-2 text-slate-800 uppercase tracking-wider flex justify-between">
                                <span>2. Anomaly Detection</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded normal-case font-mono">Sensitivity: High</span>
                            </h3>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Detected Event</th>
                                        <th className="p-3">Impact</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-3 font-bold text-slate-700">Unexpected Payroll Spike</td>
                                        <td className="p-3 text-slate-500">+$12,000 variance</td>
                                        <td className="p-3 text-slate-500 font-mono">Oct 15</td>
                                        <td className="p-3 text-right"><span className="text-xs font-bold text-orange-500 flex items-center justify-end gap-1"><WarningCircle /> Review</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-slate-700">Contractor Payout</td>
                                        <td className="p-3 text-slate-500">Normal Range</td>
                                        <td className="p-3 text-slate-500 font-mono">Oct 20</td>
                                        <td className="p-3 text-right"><span className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1"><CheckCircle /> Cleared</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Sign-off */}
                        <div className="mt-auto border-t-2 border-slate-800 pt-8 grid grid-cols-2 gap-12">
                            <div>
                                <div className="h-12 border-b border-slate-300 mb-2"></div>
                                <div className="text-[10px] font-bold uppercase text-slate-400">Chief Financial Officer</div>
                            </div>
                            <div>
                                <div className="h-12 border-b border-slate-300 mb-2 flex items-end pb-1 font-mono text-xs">{timestamp}</div>
                                <div className="text-[10px] font-bold uppercase text-slate-400">Date Generated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}