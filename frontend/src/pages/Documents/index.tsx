import { useState } from 'react';
import { 
    GoogleLogo, DropboxLogo, CloudArrowUp, 
    FilePdf, FileLock, HardDrives, 
    MagnifyingGlass, CheckCircle, Warning, 
    Users, ShieldCheck, Folder, CaretDown, CaretRight,
    UploadSimple, FileXls, PaperPlaneRight, Eye, X,
    FileText, ShareNetwork, Link as LinkIcon, Timer,
    Clock, ChartPieSlice, House, DownloadSimple
} from '@phosphor-icons/react';

// --- MOCK FILESYSTEM ---
const FOLDERS = [
    { id: 'legal', name: 'Legal Contracts', count: 12 },
    { id: 'fin', name: 'Financial Reports', count: 8 },
    { id: 'hr', name: 'Employee Records', count: 45 },
];

const FILES = [
    { id: 1, name: "Employment_Contract_A_Johnson.pdf", size: "2.4 MB", date: "Oct 24", folder: 'legal', type: 'pdf', risk: "Low", views: 3, lastViewed: "2h ago" },
    { id: 2, name: "Visa_Application_Form.pdf", size: "1.1 MB", date: "Nov 01", folder: 'hr', type: 'pdf', risk: "High", views: 12, lastViewed: "10m ago" },
    { id: 3, name: "Q3_Revenue_Sheet.xlsx", size: "4.5 MB", date: "Oct 15", folder: 'fin', type: 'xls', risk: "None", views: 1, lastViewed: "Yesterday" },
];

export default function DataVault() {
    const [viewMode, setViewMode] = useState<'browser' | 'compliance'>('browser'); 
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const filteredFiles = currentFolder ? FILES.filter(f => f.folder === currentFolder) : FILES;

    return (
        <div className="p-8 text-[var(--text-main)] animate-fade-in h-full flex flex-col relative">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight mb-2 flex items-center gap-3">
                        Data Vault
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-widest flex items-center gap-1">
                            <HardDrives weight="fill" /> 2.4GB Used
                        </span>
                    </h1>
                    <p className="text-sm opacity-70 font-medium max-w-lg">
                        Centralized repository with automated compliance scanning.
                    </p>
                </div>
                <div className="flex bg-gray-200 dark:bg-white/5 p-1 rounded-xl">
                    <button onClick={() => setViewMode('browser')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${viewMode === 'browser' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-indigo-600' : 'opacity-60 hover:opacity-100'}`}>
                        <Folder weight="bold" /> Explorer
                    </button>
                    <button onClick={() => setViewMode('compliance')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${viewMode === 'compliance' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-indigo-600' : 'opacity-60 hover:opacity-100'}`}>
                        <ShieldCheck weight="bold" /> Compliance
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 flex gap-6">
                
                {/* LEFT: NAVIGATION */}
                {viewMode === 'browser' && (
                    <div className="w-64 flex flex-col gap-2 shrink-0">
                        <button onClick={() => { setCurrentFolder(null); setSelectedFile(null); }} className={`p-3 rounded-xl flex items-center gap-3 font-bold text-sm transition ${!currentFolder ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                            <House weight="fill" /> Home Root
                        </button>
                        <div className="my-2 border-b border-gray-200 dark:border-white/10"></div>
                        <div className="text-[10px] font-bold uppercase opacity-50 mb-2 px-2">Folders</div>
                        {FOLDERS.map(folder => (
                            <button 
                                key={folder.id} 
                                onClick={() => { setCurrentFolder(folder.id); setSelectedFile(null); }}
                                className={`p-3 rounded-xl flex items-center justify-between font-bold text-sm transition ${currentFolder === folder.id ? 'bg-white dark:bg-[#1e293b] shadow-md text-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 opacity-70'}`}
                            >
                                <span className="flex items-center gap-3"><Folder weight="duotone" /> {folder.name}</span>
                                <span className="text-[10px] bg-gray-200 dark:bg-black/20 px-2 rounded-full">{folder.count}</span>
                            </button>
                        ))}
                        
                        {/* Storage Widget */}
                        <div className="mt-auto glass-card p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold">Storage</span>
                                <span className="text-[10px] opacity-60">24%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-1/4 bg-indigo-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MIDDLE: FILE GRID */}
                {viewMode === 'browser' && (
                    <div className="flex-1 glass-card p-0 flex flex-col overflow-hidden">
                        {/* Breadcrumbs */}
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-2 text-sm font-bold opacity-60">
                            <span className="hover:text-indigo-500 cursor-pointer">Vault</span>
                            <CaretRight size={12} />
                            <span>{currentFolder ? FOLDERS.find(f => f.id === currentFolder)?.name : 'All Files'}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-[10px] font-bold uppercase opacity-50 border-b border-gray-200 dark:border-white/10">
                                    <tr>
                                        <th className="p-3 pl-4">Name</th>
                                        <th className="p-3">Risk</th>
                                        <th className="p-3 text-right">Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFiles.map(f => (
                                        <tr 
                                            key={f.id} 
                                            onClick={() => setSelectedFile(f)}
                                            className={`group transition-colors cursor-pointer border-b border-gray-100 dark:border-white/5 ${selectedFile?.id === f.id ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        >
                                            <td className="p-3 pl-4 flex items-center gap-3">
                                                {f.type === 'pdf' ? <FilePdf size={24} className="text-red-500" weight="duotone" /> : <FileXls size={24} className="text-emerald-500" weight="duotone" />}
                                                <span className="font-bold text-sm">{f.name}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${f.risk === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    {f.risk}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-mono text-xs opacity-60">{f.size}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* RIGHT: SMART INSPECTOR */}
                {viewMode === 'browser' && selectedFile && (
                    <div className="w-80 glass-card p-0 flex flex-col overflow-hidden animate-fade-in-right">
                        <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                            <div className="flex justify-center mb-4">
                                {selectedFile.type === 'pdf' ? <FilePdf size={64} className="text-red-500 drop-shadow-lg" weight="duotone" /> : <FileXls size={64} className="text-emerald-500 drop-shadow-lg" weight="duotone" />}
                            </div>
                            <h3 className="text-center font-bold text-sm leading-tight mb-2">{selectedFile.name}</h3>
                            <div className="flex justify-center gap-2">
                                <button className="p-2 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm hover:text-indigo-500 transition"><Eye size={18} /></button>
                                <button className="p-2 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm hover:text-indigo-500 transition"><ShareNetwork size={18} /></button>
                                <button className="p-2 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm hover:text-indigo-500 transition"><DownloadSimple size={18} /></button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6 overflow-y-auto">
                            <div>
                                <div className="text-[10px] font-bold uppercase opacity-50 mb-2">Properties</div>
                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <span className="opacity-60">Type</span><span className="font-bold uppercase">{selectedFile.type}</span>
                                    <span className="opacity-60">Size</span><span className="font-bold">{selectedFile.size}</span>
                                    <span className="opacity-60">Created</span><span className="font-bold">{selectedFile.date}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] font-bold uppercase opacity-50 mb-2">Activity Log</div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">M</div>
                                        <div>
                                            <div className="text-xs font-bold">Marcus opened file</div>
                                            <div className="text-[10px] opacity-50">{selectedFile.lastViewed}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">S</div>
                                        <div>
                                            <div className="text-xs font-bold">System scanned risk</div>
                                            <div className="text-[10px] opacity-50">2 days ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* COMPLIANCE VIEW (Simplified for V12 to focus on Files) */}
                {viewMode === 'compliance' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                        <ShieldCheck size={64} className="mb-4" />
                        <h3 className="text-xl font-bold">Compliance Dashboard</h3>
                        <p className="max-w-md mt-2">Switch back to Explorer to manage documents. The audit runs automatically in the background.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
