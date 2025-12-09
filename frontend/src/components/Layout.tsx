import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="h-screen w-full bg-[#f3f4f6] dark:bg-[#0f172a] p-4 flex items-center justify-center font-['Raleway']">
      <div className="app-island w-full h-full max-w-[1920px] bg-white dark:bg-[#111827] rounded-[20px] shadow-2xl overflow-hidden flex relative border border-gray-200 dark:border-white/10">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e1b4b] dark:to-[#111827] text-gray-900 dark:text-gray-100">
          <Outlet /> {/* This is where the page content renders */}
        </main>
      </div>
    </div>
  );
}