import { useState } from 'react';
import { FilePdf, FileDoc, FileXls, DownloadSimple, DotsThreeVertical, Folder, MagnifyingGlass, CloudArrowUp, Clock } from '@phosphor-icons/react';

const MOCK_DOCS = [
    { id: 1, name: "Employee_Handbook_2024.pdf", type: "pdf", size: "2.4 MB", date: "Oct 24", category: "HR" },
    { id: 2, name: "Q4_Financial_Report.xlsx", type: "xls", size: "1.1 MB", date: "Nov 01", category: "Finance" },
    { id: 3, name: "NDA_Template_v2.docx", type: "doc", size: "850 KB", date: "Sep 15", category: "Legal" },
    { id: 4, name: "Onboarding_Checklist.pdf", type: "pdf", size: "1.2 MB", date: "Oct 05", category: "HR" },
    { id: 5, name: "Payroll_Summary_Oct.xlsx", type: "xls", size: "900 KB", date: "Nov 05", category: "Finance" },
    { id: 6, name: "Project_Alpha_Specs.pdf", type: "pdf", size: "4.5 MB", date: "Aug 20", category: "Product" },
];

export default function Documents() {
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'HR', 'Finance', 'Legal', 'Product'];
  
  const docs = MOCK_DOCS.filter(d => 
    (activeCategory === 'All' || d.category === activeCategory) &&
    d.name.toLowerCase().includes(filter.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FilePdf size={42} weight="duotone" className="text-red-500" />;
        case 'xls': return <FileXls size={42} weight="duotone" className="text-emerald-500" />;
        default: return <FileDoc size={42} weight="duotone" className="text-blue-500" />;
    }
  };

  return (
    <div className="p-8 animate-fade-in text-[var(--text-main)] h-full flex flex-col">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight mb-2">Documents</h1>
            <p className="text-sm opacity-70 font-medium">Secure repository for contracts, policies, and reports.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition">
                <CloudArrowUp size={18} weight="bold" /> Upload
            </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 shrink-0">
        <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                placeholder="Search files..." 
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition backdrop-blur-sm"
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 overflow-y-auto pb-8 custom-scrollbar">
        
        {/* Mock Folder */}
        <div className="glass-card !bg-amber-100/50 dark:!bg-amber-900/20 border-amber-200 dark:border-amber-700/30 p-4 flex flex-col items-center text-center group cursor-pointer hover:scale-105 transition-transform duration-300 min-h-[180px] justify-between">
            <div className="w-full flex justify-end"><DotsThreeVertical className="opacity-0 group-hover:opacity-50" /></div>
            <Folder size={64} weight="fill" className="text-amber-400 drop-shadow-md" />
            <div className="w-full">
                <div className="text-sm font-bold text-amber-900 dark:text-amber-100">Archived 2023</div>
                <div className="text-[10px] opacity-60 font-bold uppercase mt-1">12 Files</div>
            </div>
        </div>

        {docs.map(doc => (
            <div key={doc.id} className="glass-card p-4 flex flex-col items-center text-center group cursor-pointer hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 min-h-[180px] relative">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded">
                    <DotsThreeVertical />
                </div>
                
                <div className="flex-1 flex items-center justify-center mt-2 group-hover:-translate-y-2 transition-transform duration-300">
                    {getIcon(doc.type)}
                </div>
                
                <div className="w-full mt-4">
                    <div className="text-xs font-bold truncate w-full mb-1" title={doc.name}>{doc.name}</div>
                    <div className="flex justify-between items-center text-[10px] opacity-50 font-medium">
                        <span>{doc.size}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {doc.date}</span>
                    </div>
                </div>

                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full py-2 text-[10px] font-bold bg-indigo-600 text-white rounded-lg shadow-lg flex items-center justify-center gap-2">
                        <DownloadSimple size={14} /> Download
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}