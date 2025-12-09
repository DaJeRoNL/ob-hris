import { useAuth } from '../context/AuthContext';
import { MOCK_DB } from '../utils/mockData';
import { CheckCircle } from '@phosphor-icons/react';

export default function ClientProfile() {
  const { currentClientId, setClientId } = useAuth();
  const currentClient = MOCK_DB.clients.find(c => c.id === currentClientId);

  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 text-[var(--text-main)]">
        <h1 className="text-3xl font-bold font-['Montserrat']">Context Manager</h1>
        <p className="text-sm opacity-70 mt-1">Select Client Environment to View</p>
      </header>

      {/* Current Client Hero */}
      <div className="glass-card mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent">
        <div className={`w-32 h-32 rounded-2xl bg-${currentClient?.color || 'indigo'}-500 flex items-center justify-center text-5xl font-bold text-white shadow-xl z-10 shrink-0`}>
          {currentClient?.initial}
        </div>
        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-4xl font-bold mb-2 text-[var(--text-main)]">{currentClient?.name}</h2>
          <p className="opacity-70 max-w-xl text-[var(--text-main)]">
            Environment ID: <span className="font-mono text-xs bg-gray-500/20 px-2 py-1 rounded">{currentClient?.id}</span>
          </p>
          <div className="flex gap-4 mt-4 justify-center md:justify-start flex-wrap">
            <span className="pill pill-green">Secure Connection</span>
            <span className="pill pill-blue">RLS Enabled</span>
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-6 text-xl flex items-center gap-2 text-[var(--text-main)]">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> Available Environments
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {MOCK_DB.clients.map(client => {
          const isActive = currentClientId === client.id;
          return (
            <div 
              key={client.id}
              onClick={() => setClientId(client.id)}
              className={`glass-card cursor-pointer transition-all hover:scale-[1.02] 
                ${isActive ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded bg-${client.color}-500 text-white flex items-center justify-center font-bold shadow-lg`}>
                  {client.initial}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[var(--text-main)]">{client.name}</div>
                  <div className="text-xs opacity-50 font-mono text-[var(--text-main)]">{client.id}</div>
                </div>
                {isActive && <CheckCircle size={24} weight="fill" className="text-indigo-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}