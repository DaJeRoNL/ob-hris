import { useState } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { PaperPlaneRight, LockKey } from '@phosphor-icons/react';

export default function Chat() {
  const { currentClientId } = useAuth();
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  // Mock local state for messages
  const [messages, setMessages] = useState<{text: string, fromMe: boolean}[]>([]);

  const people = MOCK_DB.people.filter(p => p.clientId === currentClientId);
  const activePerson = people.find(p => p.id === activeUser);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!message.trim()) return;
    setMessages([...messages, { text: message, fromMe: true }]);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col md:flex-row text-gray-900 dark:text-gray-100 animate-fade-in">
      {/* Sidebar List */}
      <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-800/30 border-r border-gray-200 dark:border-white/10 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="font-bold text-sm uppercase opacity-60">Team Directory</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div 
            onClick={() => setActiveUser(null)}
            className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition
              ${activeUser === null ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">#</div>
            <div className="text-sm font-bold">General</div>
          </div>
          {people.map(p => (
            <div 
              key={p.id}
              onClick={() => setActiveUser(p.id)}
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition
                ${activeUser === p.id ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                {p.name[0]}
              </div>
              <div className="text-sm font-medium">{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/50 dark:bg-transparent">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-[#111827]">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {activePerson ? activePerson.name[0] : '#'}
          </div>
          <div>
            <div className="font-bold">{activePerson ? activePerson.name : 'General Channel'}</div>
            <div className="text-xs opacity-60 flex items-center gap-1">
              <LockKey size={12} /> End-to-end encrypted
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center opacity-40 text-xs mt-10">
            This is the beginning of your history with {activePerson ? activePerson.name : 'everyone'}.
          </div>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                m.fromMe 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827]">
          <div className="flex gap-2">
            <input 
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="flex-1 input-glass rounded-xl px-4 py-3"
              placeholder="Type a message..."
            />
            <button className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg">
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}