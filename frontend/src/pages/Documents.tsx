import { useState } from 'react';
import { FilePdf, FileDoc, FileXls, DownloadSimple, DotsThreeVertical } from '@phosphor-icons/react';

const MOCK_DOCS = [
    { id: 1, name: "Employee_Handbook_2024.pdf", type: "pdf", size: "2.4 MB", date: "Oct 24" },
    { id: 2, name: "Q4_Financial_Report.xlsx", type: "xls", size: "1.1 MB", date: "Nov 01" },
    { id: 3, name: "NDA_Template_v2.docx", type: "doc", size: "850 KB", date: "Sep 15" },
    { id: 4, name: "Onboarding_Checklist.pdf", type: "pdf", size: "1.2 MB", date: "Oct 05" },
    { id: 5, name: "Payroll_Summary_Oct.xlsx", type: "xls", size: "900 KB", date: "Nov 05" },
];

export default function Documents() {
  const [filter, setFilter] = useState('');

  const docs = MOCK_DOCS.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));

  const getIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FilePdf size={32} className="text-red-500" />;
        case 'xls': return <FileXls size={32} className="text-green-500" />;
        default: return <FileDoc size={32} className="text-blue-500" />;
    }
  };

  return (
    <div className="p-8 animate-fade-in text-[var(--text-main)]">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold font-['Montserrat']">Documents</h1>
            <p className="text-sm opacity-70">Repository & Contracts</p>
        </div>
        <div className="flex gap-2">
            <input 
                placeholder="Search files..." 
                className="input-glass w-64 text-sm"
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {docs.map(doc => (
            <div key={doc.id} className="glass-card p-4 flex flex-col items-center text-center group cursor-pointer hover:border-indigo-500/30 transition">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <DotsThreeVertical />
                </div>
                <div className="mb-3 p-3 bg-gray-500/5 rounded-xl group-hover:scale-110 transition-transform">
                    {getIcon(doc.type)}
                </div>
                <div className="text-sm font-bold truncate w-full mb-1" title={doc.name}>{doc.name}</div>
                <div className="text-xs opacity-60 flex gap-2">
                    <span>{doc.size}</span>•<span>{doc.date}</span>
                </div>
                <button className="mt-3 w-full py-1 text-xs bg-gray-500/10 hover:bg-indigo-500 hover:text-white rounded-lg transition flex items-center justify-center gap-1">
                    <DownloadSimple /> Download
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}