import { useState, useEffect } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { Plus, Trash, Gear, LockKey, LockOpen, CheckCircle, Warning, Layout, Sidebar, ShieldCheck, Question, Globe, Bell, UserSwitch } from '@phosphor-icons/react';
import { getSystemConfig, saveSystemConfig, resetSystemConfig, SystemConfig, getCurrentRole, setCurrentRole, UserRole } from '../utils/dashboardConfig';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'general' | 'environments' | 'layout' | 'navigation'>('general');
  const [clientName, setClientName] = useState('');
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [currentSimRole, setCurrentSimRole] = useState<UserRole>(getCurrentRole());
  const [isUnlocked, setIsUnlocked] = useState(false);

  // The Active Role (Real User)
  const activeUserRole = getCurrentRole(); 
  const isSystemAdmin = activeUserRole === 'System Admin';

  useEffect(() => { setConfig(getSystemConfig()); }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRole = e.target.value as UserRole;
      setCurrentSimRole(newRole);
      setCurrentRole(newRole);
      // Force reload to apply permissions to sidebar immediately
      setTimeout(() => window.location.reload(), 100);
  };

  const handleSettingChange = (field: keyof SystemConfig['settings'], value: any) => {
      const newConfig = { ...config };
      // @ts-ignore
      newConfig.settings[field] = value;
      setConfig(newConfig);
      saveSystemConfig(newConfig);
  };

  const toggleConfig = (role: UserRole, type: 'widgets' | 'tabs', key: string) => {
      const newConfig = { ...config };
      // @ts-ignore
      newConfig.layout[role][type][key] = !newConfig.layout[role][type][key];
      setConfig(newConfig);
      saveSystemConfig(newConfig);
  };

  const LockedScreen = () => (
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 h-[400px]">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4"><LockKey size={32} weight="duotone" /></div>
          <h2 className="text-xl font-bold mb-2">Protected Configuration</h2>
          <p className="text-sm max-w-md mb-6">Sensitive system settings are locked. You must be a System Admin to modify these parameters.</p>
          {isSystemAdmin && (
              <button onClick={() => setIsUnlocked(true)} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition flex items-center gap-2"><LockOpen weight="fill" /> Unlock System</button>
          )}
      </div>
  );

  return (
    <div className="p-8 animate-fade-in text-[var(--text-main)] h-full flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-8 shrink-0">
          <h1 className="text-2xl font-bold font-['Montserrat'] text-red-500 flex items-center gap-2"><Gear weight="duotone" /> System Administration</h1>
          <p className="text-sm opacity-70">Global Config & Environment Provisioning</p>
      </div>

      {/* TABS */}
      <div className="bg-gray-200 dark:bg-white/5 p-1 rounded-xl flex gap-1 mb-6 shrink-0 overflow-x-auto">
          <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>General Settings</TabButton>
          {/* Only show these tabs if System Admin OR unlocked (for simulation) */}
          {(isSystemAdmin || isUnlocked) && (
              <>
                  <TabButton active={activeTab === 'environments'} onClick={() => setActiveTab('environments')}>Environments</TabButton>
                  <TabButton active={activeTab === 'layout'} onClick={() => setActiveTab('layout')}>Dash Layout</TabButton>
                  <TabButton active={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')}>Nav Permissions</TabButton>
              </>
          )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
          
          {/* GENERAL */}
          {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="glass-card">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><UserSwitch size={20} className="text-indigo-500" /> User Simulation</h3>
                      <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                          <label className="text-xs font-bold uppercase opacity-70 block mb-2">Current Active Role</label>
                          <select value={currentSimRole} onChange={handleRoleChange} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 font-bold focus:ring-2 ring-indigo-500 outline-none">
                              <option value="System Admin">System Admin (Full Access)</option>
                              <option value="Executive">Executive</option>
                              <option value="Manager">Manager</option>
                              <option value="HR_Admin">HR Admin</option>
                              <option value="Employee">Employee (Restricted)</option>
                          </select>
                          <div className="mt-2 text-[10px] opacity-60">
                              Logged in as: <span className="font-bold text-indigo-500">{activeUserRole}</span>
                          </div>
                      </div>
                  </div>

                  <div className="glass-card">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-emerald-500" /> Localization</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Date Format</span>
                              <select 
                                value={config.settings.dateFormat} 
                                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                                className="bg-transparent border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-xs"
                              >
                                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              </select>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">System Currency</span>
                              <select value={config.settings.currency} onChange={(e) => handleSettingChange('currency', e.target.value)} className="bg-transparent border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-xs"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* PROTECTED TABS */}
          {activeTab === 'environments' && (!isUnlocked ? <LockedScreen /> : 
              <div className="animate-fade-in"><h3 className="font-bold mb-4">Environment Provisioning</h3><div className="glass-card p-4 text-center opacity-50">Provisioning Module Active</div></div>
          )}

          {activeTab === 'layout' && (!isUnlocked ? <LockedScreen /> :
              <div className="glass-card animate-fade-in">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                      <h3 className="font-bold text-lg">Dashboard Widgets</h3>
                      <button onClick={() => setConfig(resetSystemConfig())} className="text-xs text-red-400 hover:underline">Reset Defaults</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {['System Admin', 'Executive', 'Manager', 'HR_Admin', 'Employee'].map(role => (
                          <ConfigColumn key={role} role={role} data={config.layout[role as UserRole].widgets} onToggle={(key) => toggleConfig(role as UserRole, 'widgets', key)} title={role} />
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'navigation' && (!isUnlocked ? <LockedScreen /> :
              <div className="glass-card animate-fade-in">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                      <h3 className="font-bold text-lg">Sidebar Access</h3>
                      <button onClick={() => setConfig(resetSystemConfig())} className="text-xs text-red-400 hover:underline">Reset Defaults</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {['System Admin', 'Executive', 'Manager', 'HR_Admin', 'Employee'].map(role => (
                          <ConfigColumn key={role} role={role} data={config.layout[role as UserRole].tabs} onToggle={(key) => toggleConfig(role as UserRole, 'tabs', key)} title={role} />
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}

const TabButton = ({ active, children, onClick }: any) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${active ? 'bg-white dark:bg-[#1e293b] shadow-sm' : 'opacity-50 hover:opacity-100'}`}>{children}</button>
);

const ConfigColumn = ({ data, onToggle, title }: any) => (
    <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 text-center border-b border-white/5 pb-2">{title}</h4>
        {Object.keys(data).map((key) => (
            <div key={key} className="group flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 hover:border-indigo-500/30 transition" title={`Toggle ${key}`}>
                <span className="capitalize font-bold text-[10px] truncate mr-2">{key}</span>
                <button onClick={() => onToggle(key)} className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ${data[key] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${data[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
            </div>
        ))}
    </div>
);