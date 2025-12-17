import { useState } from 'react';
import { 
    SlackLogo, MicrosoftTeamsLogo, Envelope, 
    CheckCircle, X, PaperPlaneRight, 
    Robot, Tag, Warning, ChatCircleDots,
    ArrowRight, ShareNetwork
} from '@phosphor-icons/react';

// --- TYPES ---
interface Message {
    id: number;
    source: 'slack' | 'email' | 'teams';
    sender: string;
    avatar: string;
    subject: string; // or preview
    body: string;
    timestamp: string;
    aiAnalysis: string;
    intentTag: string;
    isRead: boolean;
}

// --- MOCK DATA ---
const INBOX: Message[] = [
    { 
        id: 1, source: 'slack', sender: 'Marcus (Dev)', avatar: 'M',
        subject: 'Sick Day', body: 'Hey, I woke up feeling terrible. Not gonna make standup, taking a sick day.', 
        timestamp: '10 mins ago', aiAnalysis: 'Intent: Leave Request. High Confidence.', intentTag: 'HR Request', isRead: false 
    },
    { 
        id: 2, source: 'email', sender: 'Vendor: AWS', avatar: 'A',
        subject: 'Invoice #9921 Overdue', body: 'Invoice #9921 is overdue. Amount: $4,200. Please process immediately to avoid service interruption.', 
        timestamp: '45 mins ago', aiAnalysis: 'Action: Payment Required. Critical Priority.', intentTag: 'Finance', isRead: false 
    },
    { 
        id: 3, source: 'teams', sender: 'Sarah (Design)', avatar: 'S',
        subject: 'Assets for Q4 Campaign', body: 'I dropped the new assets in the shared drive. Can you review them before 2pm?', 
        timestamp: '2 hours ago', aiAnalysis: 'Action: Review Document.', intentTag: 'Collaboration', isRead: true 
    },
];

export default function CommLink() {
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(INBOX[0]);
    const [messages, setMessages] = useState(INBOX);

    const handlePushToBoard = (id: number) => {
        // In a real app, this would POST to the Tasks endpoint
        alert("✅ Converted to Ticket & Pushed to Central Task Board");
        setMessages(prev => prev.filter(m => m.id !== id));
        setSelectedMsg(null);
    };

    return (
        <div className="h-full flex gap-0 bg-white dark:bg-[#020617] text-[var(--text-main)] animate-fade-in overflow-hidden relative">
            
            {/* SIDEBAR: INBOX LIST */}
            <div className="w-96 border-r border-gray-200 dark:border-white/10 flex flex-col bg-gray-50/50 dark:bg-[#0f172a]">
                <div className="p-6 pb-4 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-black font-['Montserrat'] flex items-center gap-2">
                        <ChatCircleDots className="text-indigo-500" weight="duotone" />
                        My Inbox
                    </h2>
                    <p className="text-xs opacity-60 mt-1">Personalized Stream • {messages.length} Unresolved</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {messages.map(msg => (
                        <div 
                            key={msg.id}
                            onClick={() => setSelectedMsg(msg)}
                            className={`p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer transition-all hover:bg-white dark:hover:bg-white/5 ${selectedMsg?.id === msg.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {msg.source === 'slack' && <SlackLogo className="text-[#E01E5A]" weight="fill" />}
                                    {msg.source === 'email' && <Envelope className="text-blue-500" weight="fill" />}
                                    {msg.source === 'teams' && <MicrosoftTeamsLogo className="text-[#6264A7]" weight="fill" />}
                                    <span className={`text-xs font-bold ${!msg.isRead ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-70'}`}>{msg.sender}</span>
                                </div>
                                <span className="text-[10px] opacity-40">{msg.timestamp}</span>
                            </div>
                            <h4 className="font-bold text-sm mb-1 truncate">{msg.subject}</h4>
                            <p className="text-xs opacity-60 line-clamp-2">{msg.body}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[9px] uppercase font-bold bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded opacity-60">{msg.intentTag}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT: MESSAGE DETAIL */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#020617] relative">
                {selectedMsg ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {selectedMsg.avatar}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold font-['Montserrat'] mb-1">{selectedMsg.subject}</h1>
                                    <div className="flex items-center gap-3 text-sm opacity-60">
                                        <span>From: <strong>{selectedMsg.sender}</strong></span>
                                        <span>•</span>
                                        <span className="capitalize">{selectedMsg.source}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition"><X size={24} /></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {/* AI Insight Box */}
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
                                <div className="p-2 bg-indigo-500 text-white rounded-lg shrink-0"><Robot weight="fill" size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">AI Context Analysis</h4>
                                    <p className="text-sm opacity-80 leading-relaxed">{selectedMsg.aiAnalysis}</p>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium opacity-80 max-w-3xl">
                                {selectedMsg.body}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0f172a] flex justify-between items-center">
                            <div className="flex gap-4">
                                <button className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-white/5 transition flex items-center gap-2">
                                    <PaperPlaneRight weight="bold" /> Reply
                                </button>
                                <button className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-white/5 transition text-red-500 hover:border-red-200">
                                    Ignore
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => handlePushToBoard(selectedMsg.id)}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition transform active:scale-95 flex items-center gap-3"
                            >
                                <ShareNetwork weight="fill" size={18} />
                                Share to Task Board
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <ChatCircleDots size={64} weight="duotone" className="mb-4" />
                        <h3 className="text-xl font-bold">Select a message</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
