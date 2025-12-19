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
        <div className="h-full flex gap-0 bg-[var(--color-bg)] text-[var(--color-text)] animate-fade-in overflow-hidden relative">
            
            {/* SIDEBAR: INBOX LIST */}
            <div className="w-96 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-surface)]/50">
                <div className="p-6 pb-4 border-b border-[var(--color-border)]">
                    <h2 className="text-xl font-black font-['Montserrat'] flex items-center gap-2">
                        <ChatCircleDots className="text-[var(--color-primary)]" weight="duotone" />
                        My Inbox
                    </h2>
                    <p className="text-xs opacity-60 mt-1 text-[var(--color-text-muted)]">Personalized Stream • {messages.length} Unresolved</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {messages.map(msg => (
                        <div 
                            key={msg.id}
                            onClick={() => setSelectedMsg(msg)}
                            className={`p-4 border-b border-[var(--color-border)] cursor-pointer transition-all hover:bg-[var(--color-surface)] ${selectedMsg?.id === msg.id ? 'bg-[var(--color-surface)] border-l-4 border-l-[var(--color-primary)]' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {msg.source === 'slack' && <SlackLogo className="text-[var(--color-danger)]" weight="fill" />}
                                    {msg.source === 'email' && <Envelope className="text-[var(--color-info)]" weight="fill" />}
                                    {msg.source === 'teams' && <MicrosoftTeamsLogo className="text-[var(--color-primary)]" weight="fill" />}
                                    <span className={`text-xs font-bold ${!msg.isRead ? 'text-[var(--color-primary)]' : 'opacity-70 text-[var(--color-text-muted)]'}`}>{msg.sender}</span>
                                </div>
                                <span className="text-[10px] opacity-40 text-[var(--color-text-muted)]">{msg.timestamp}</span>
                            </div>
                            <h4 className="font-bold text-sm mb-1 truncate text-[var(--color-text)]">{msg.subject}</h4>
                            <p className="text-xs opacity-60 line-clamp-2 text-[var(--color-text-muted)]">{msg.body}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="text-[9px] uppercase font-bold bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5 rounded opacity-60 text-[var(--color-text-muted)]">{msg.intentTag}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT: MESSAGE DETAIL */}
            <div className="flex-1 flex flex-col bg-[var(--color-bg)] relative">
                {selectedMsg ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {selectedMsg.avatar}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold font-['Montserrat'] mb-1 text-[var(--color-text)]">{selectedMsg.subject}</h1>
                                    <div className="flex items-center gap-3 text-sm opacity-60 text-[var(--color-text-muted)]">
                                        <span>From: <strong>{selectedMsg.sender}</strong></span>
                                        <span>•</span>
                                        <span className="capitalize">{selectedMsg.source}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-2 hover:bg-[var(--color-surface)] rounded-full transition text-[var(--color-text-muted)] hover:text-[var(--color-text)]"><X size={24} /></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {/* AI Insight Box */}
                            <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-4 mb-8 flex items-start gap-4">
                                <div className="p-2 bg-[var(--color-primary)] text-white rounded-lg shrink-0"><Robot weight="fill" size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--color-primary)] mb-1">AI Context Analysis</h4>
                                    <p className="text-sm opacity-80 leading-relaxed text-[var(--color-text)]">{selectedMsg.aiAnalysis}</p>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium opacity-80 max-w-3xl text-[var(--color-text)]">
                                {selectedMsg.body}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center">
                            <div className="flex gap-4">
                                <button className="px-6 py-3 border border-[var(--color-border)] rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] transition flex items-center gap-2 text-[var(--color-text)]">
                                    <PaperPlaneRight weight="bold" /> Reply
                                </button>
                                <button className="px-6 py-3 border border-[var(--color-border)] rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] transition text-[var(--color-danger)] hover:border-[var(--color-danger)]/30">
                                    Ignore
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => handlePushToBoard(selectedMsg.id)}
                                className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:brightness-110 text-white rounded-xl font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 transition transform active:scale-95 flex items-center gap-3"
                            >
                                <ShareNetwork weight="fill" size={18} />
                                Share to Task Board
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-[var(--color-text-muted)]">
                        <ChatCircleDots size={64} weight="duotone" className="mb-4" />
                        <h3 className="text-xl font-bold">Select a message</h3>
                    </div>
                )}
            </div>
        </div>
    );
}