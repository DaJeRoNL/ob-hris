import { useState } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { Plus, Trash } from '@phosphor-icons/react';

export default function Admin() {
  const [clientName, setClientName] = useState('');
  const [, setTick] = useState(0); // Force refresh

  const handleCreate = () => {
    if (!clientName) return;
    const newId = `c${MOCK_DB.clients.length + 1}`;
    const colors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    MOCK_DB.clients.push({
      id: newId,
      name: clientName,
      initial: clientName[0].toUpperCase(),
      color: randomColor
    });

    setClientName('');
    setTick(t => t + 1); 
    alert(`Environment ${clientName} Provisioned!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (MOCK_DB.clients.length <= 1) {
        alert("Cannot delete the last active environment.");
        return;
    }

    // Strict Warning
    const confirmed = window.confirm(
        `⚠️ CRITICAL WARNING ⚠️\n\nYou are about to DELETE the environment: ${name} (${id}).\n\nThis action cannot be undone. All associated data (People, Finance, Chats) will be lost.\n\nAre you absolutely sure?`
    );

    if (confirmed) {
        const index = MOCK_DB.clients.findIndex(c => c.id === id);
        if (index > -1) {
            MOCK_DB.clients.splice(index, 1);
            setTick(t => t + 1); // Refresh UI
        }
    }
  };

  return (
    <div className="p-8 animate-fade-in text-[var(--text-main)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-['Montserrat'] text-red-500">Environment Admin</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Panel */}
        <div className="glass-card border-l-4 border-l-red-500">
          <h3 className="font-bold mb-4">Create Client Environment</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase opacity-70">Client Name</label>
              <input 
                type="text" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="input-glass mt-1" 
                placeholder="e.g. Wayne Enterprises" 
              />
            </div>
            <button 
              onClick={handleCreate}
              className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <Plus weight="bold" /> Provision Environment
            </button>
          </div>
        </div>

        {/* List Panel */}
        <div className="glass-card">
          <h3 className="font-bold mb-4">Active Environments</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_DB.clients.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-500/5 rounded-lg border border-gray-500/10 hover:bg-gray-500/10 transition">
                <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded bg-${c.color}-500 flex items-center justify-center text-[10px] text-white font-bold`}>
                        {c.initial}
                    </div>
                    <div className="font-bold text-sm">{c.name}</div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs font-mono opacity-50">{c.id}</div>
                    <button 
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Delete Environment"
                    >
                        <Trash size={16} weight="bold" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}