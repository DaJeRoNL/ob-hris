import { useState, useEffect } from 'react';
import { Gear, LockKey, LockOpen, Globe, UserSwitch, ShieldCheck, Database, BellRinging, ToggleLeft, ToggleRight, ArrowCounterClockwise, WarningCircle } from '@phosphor-icons/react';
import { getSystemConfig, saveSystemConfig, resetSystemConfig, SystemConfig, getCurrentRole, setCurrentRole, UserRole } from '../../utils/dashboardConfig';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'layout'>('general');
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [currentSimRole, setCurrentSimRole] = useState<UserRole>(getCurrentRole());
  const [isUnlocked, setIsUnlocked] = useState(false);

  const activeUserRole = getCurrentRole(); 
  const isSystemAdmin = activeUserRole === 'System Admin';

  useEffect(() => { setConfig(getSystemConfig()); }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRole = e.target.value as UserRole;
      setCurrentSimRole(newRole);
      setCurrentRole(newRole);
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

  const handleFactoryReset = () => {
      if(confirm('⚠️ FACTORY RESET: This will wipe all demo data, local changes, and timer history. Are you sure?')) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const LockedScreen = () => (
      <div className="flex-1 flex flex-col items-center justify-center text-center h-[400px] bg-red-500/5 rounded-2xl border-2 border-dashed border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4"><LockKey size={32} weight="duotone" /></div>
          <h2 className="text-xl font-bold mb-2">Protected Configuration</h2>
          <p className="text-sm max-w-md mb-6 opacity-70">Sensitive system settings are locked. You must be a System Admin to modify these parameters.</p>
          {isSystemAdmin && (
              <button onClick={() => setIsUnlocked(true)} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition flex items-center gap-2"><LockOpen weight="fill" /> Unlock System</button>
          )}
      </div>
  );

  return (
    <div className="p-8 animate-fade-in text-[var(--text-main)] h-full flex flex-col overflow-hidden">
      
      <div className="mb-8 shrink-0 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black font-['Montserrat'] flex items-center gap-3">
                <Gear weight="duotone" className="text-slate-400" /> System Administration
            </h1>
            <p className="text-sm opacity-70 font-medium mt-1">Global Configuration & Environment Provisioning</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setConfig(resetSystemConfig())} className="text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition">Restore Defaults</button>
          </div>
      </div>

      <div className="flex gap-6 h-full min-h-0">
          <div className="w-64 shrink-0 flex flex-col gap-2">
              <button onClick={() => setActiveTab('general')} className={`p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition ${activeTab === 'general' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                  <Globe size={18} /> General Settings
              </button>
              <button onClick={() => setActiveTab('layout')} className={`p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition ${activeTab === 'layout' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                  <UserSwitch size={18} /> Role & Layout
              </button>
              <button onClick={() => setActiveTab('security')} className={`p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                  <ShieldCheck size={18} /> Security & Audit
              </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
              
              {activeTab === 'general' && (
                  <div className="space-y-6">
                      <div className="glass-card">
                          <h3 className="font-bold mb-6 flex items-center gap-2 text-lg"><UserSwitch size={24} className="text-indigo-500" /> User Simulation</h3>
                          <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20">
                              <label className="text-xs font-bold uppercase opacity-70 block mb-2">Current Active Role</label>
                              <div className="flex gap-4 items-center">
                                <select value={currentSimRole} onChange={handleRoleChange} className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold focus:ring-2 ring-indigo-500 outline-none min-w-[200px]">
                                    <option value="System Admin">System Admin (Full Access)</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Manager">Manager</option>
                                    <option value="HR_Admin">HR Admin</option>
                                    <option value="Employee">Employee (Restricted)</option>
                                </select>
                                <div className="text-xs opacity-60">
                                    Logged in as: <span className="font-bold text-indigo-500">{activeUserRole}</span>
                                </div>
                              </div>
                          </div>
                      </div>

                      <div className="glass-card !border-red-500/30">
                          <h3 className="font-bold mb-6 flex items-center gap-2 text-lg text-red-500"><WarningCircle size={24} weight="fill" /> Danger Zone</h3>
                          <div className="flex items-center justify-between">
                              <div>
                                  <div className="font-bold text-sm">Factory Reset Demo</div>
                                  <div className="text-xs opacity-60">Wipes LocalStorage, Mock Data, and Auth Tokens.</div>
                              </div>
                              <button onClick={handleFactoryReset} className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition flex items-center gap-2">
                                  <ArrowCounterClockwise weight="bold" /> Reset All
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'layout' && (!isUnlocked ? <LockedScreen /> :
                  <div className="glass-card">
                      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                          <h3 className="font-bold text-lg">Dashboard Widgets Configuration</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {['System Admin', 'Executive', 'Manager', 'HR_Admin', 'Employee'].map(role => (
                              <div key={role} className="space-y-3">
                                  <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 text-center border-b border-white/5 pb-2">{role}</h4>
                                  {Object.keys(config.layout[role as UserRole].widgets).map((key) => (
                                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent hover:border-indigo-500/30 transition">
                                          <span className="capitalize font-bold text-[10px] truncate mr-2">{key}</span>
                                          <button onClick={() => toggleConfig(role as UserRole, 'widgets', key)} className="text-indigo-500 hover:text-indigo-400">
                                              {/* @ts-ignore */}
                                              {config.layout[role].widgets[key] ? <ToggleRight size={24} weight="fill" /> : <ToggleLeft size={24} className="opacity-30" />}
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
              
              {activeTab === 'security' && (!isUnlocked ? <LockedScreen /> : 
                  <div className="glass-card">
                      <h3 className="font-bold mb-6 flex items-center gap-2 text-lg"><ShieldCheck size={24} className="text-indigo-500" /> Security Policies</h3>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                              <div>
                                  <div className="font-bold text-sm">Enforce Two-Factor Authentication</div>
                                  <div className="text-xs opacity-60">Require 2FA for all Admin and Manager roles.</div>
                              </div>
                              <button className="text-emerald-500"><ToggleRight size={32} weight="fill" /></button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
