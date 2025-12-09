import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    // The body styling in globals.css handles the centering and padding now.
    // We just need the app-island container here.
    <div className="app-island">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative" style={{ background: 'var(--bg-main-gradient)', color: 'var(--text-main)' }}>
        <Outlet /> 
      </main>
    </div>
  );
}