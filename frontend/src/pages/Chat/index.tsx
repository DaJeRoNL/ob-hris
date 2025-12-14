import { useState, useRef, useEffect } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { PaperPlaneRight, LockKey, MagnifyingGlass, Phone, VideoCamera, Info, Smiley, Paperclip, Check } from '@phosphor-icons/react';

export default function Chat() {
  const { currentClientId } = useAuth();
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, fromMe: boolean, time: string}[]>([
      { text: "Hey, did you see the new compliance report?", fromMe: false, time: "09:41 AM" },
      { text: "Yes! Looks great. Just need to sign off on the German entity.", fromMe: true, time: "09:42 AM" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const people = MOCK_DB.people.filter(p => p.clientId === currentClientId);
  const activePerson = people.find(p => p.id === activeUser);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!message.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { text: message, fromMe: true, time }]);
    setMessage('');
  };

  return (
    <div className="h-full flex overflow-hidden animate-fade-in bg-white dark:bg-[#0f172a]">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200 dark:border-white/10 flex flex-col bg-gray-50/50 dark:bg-[#111827]">
        <div className="p-5 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold font-['Montserrat'] mb-4">Messages</h2>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm outline-none focus:border-indigo-500 transition" placeholder="Search..." />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <div onClick={() => setActiveUser(null)} className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition ${activeUser === null ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">#</div>
            <div className="flex-1">
                <div className="text-sm font-bold">General Team</div>
                <div className="text-xs opacity-70 truncate">Alice: Meeting in 5 mins?</div>
            </div>
          </div>
          
          <div className="px-3 py-2 text-[10px] font-bold uppercase opacity-40 mt-2">Direct Messages</div>
          
          {people.map(p => (
            <div key={p.id} onClick={() => setActiveUser(p.id)} className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition group ${activeUser === p.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
              <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:scale-105 transition-transform">
                    {p.name[0]}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-bold truncate">{p.name}</div>
                    <div className="text-[10px] opacity-60">12m</div>
                </div>
                <div className="text-xs opacity-60 truncate">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-transparent relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
              {activePerson ? activePerson.name[0] : '#'}
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-main)]">{activePerson ? activePerson.name : 'General Channel'}</div>
              <div className="text-xs opacity-60 flex items-center gap-1 text-emerald-500 font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Online
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-indigo-500">
            <button className="p-2 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-full transition"><Phone weight="fill" size={20} /></button>
            <button className="p-2 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-full transition"><VideoCamera weight="fill" size={20} /></button>
            <button className="p-2 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-full transition"><Info weight="bold" size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          <div className="flex justify-center my-4">
            <span className="text-[10px] font-bold bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-full opacity-60">Today</span>
          </div>
          
          <div className="text-center opacity-40 text-xs mb-8 flex flex-col items-center gap-2">
            <LockKey size={24} />
            <span>Messages are end-to-end encrypted. No one outside of this chat, not even Admin, can read them.</span>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex flex-col ${m.fromMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm relative ${
                    m.fromMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-[#1e293b] text-[var(--text-main)] border border-gray-100 dark:border-white/5 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                  <div className="text-[10px] opacity-40 mt-1 flex items-center gap-1 font-bold">
                    {m.time} {m.fromMe && <Check weight="bold" />}
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-white/10">
            <form onSubmit={sendMessage} className="flex gap-2 items-end">
                <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:border-indigo-500/50 transition">
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-500 transition"><Paperclip size={20} /></button>
                    <input 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm max-h-32 py-2"
                        placeholder="Type a message..."
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-indigo-500 transition"><Smiley size={20} /></button>
                </div>
                <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition hover:scale-105 active:scale-95 mb-1">
                    <PaperPlaneRight size={20} weight="fill" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}