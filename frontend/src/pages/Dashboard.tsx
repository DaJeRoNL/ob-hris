import { useEffect, useState } from 'react';
import { MOCK_DB } from '../utils/mockData';

interface DashboardStats {
  headcount: number;
  payroll: string;
  roles: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({ headcount: 0, payroll: '0', roles: 0 });

  useEffect(() => {
    // In a real scenario, this would be an async Supabase call
    // const { data } = await supabase.from('people').select('*');
    
    const headcount = MOCK_DB.people.length;
    const payroll = (headcount * 5.9).toFixed(1);
    const roles = MOCK_DB.hiring.length;
    
    setStats({ headcount, payroll, roles });
  }, []);

  return (
    <div className="animate-fade-in text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-30 px-8 py-6 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-['Montserrat']">Acme Corp Dashboard</h1>
          <p className="text-sm opacity-70 mt-1">Overview & Analytics</p>
        </div>
        <button className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur text-sm font-semibold hover:bg-white/20 transition">
          Export Report
        </button>
      </header>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Talent" value={stats.headcount} sub="▲ 4% Growth" subColor="text-green-500" />
        <StatCard title="Monthly Spend" value={`$${stats.payroll}k`} sub="Projection" subColor="opacity-50" />
        <StatCard title="Compliance" value="98%" sub="Audit Ready" subColor="text-green-500" />
        <StatCard title="Open Roles" value={stats.roles} sub="Active Reqs" subColor="opacity-50" />
      </div>
    </div>
  );
}

// Internal Component with Props Interface
interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  subColor: string;
}

function StatCard({ title, value, sub, subColor }: StatCardProps) {
  return (
    <div className="bg-white/90 dark:bg-[#1e293b]/70 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase opacity-60">{title}</h3>
      <div className="text-4xl font-bold mt-2">{value}</div>
      <div className={`text-xs mt-2 font-bold ${subColor}`}>{sub}</div>
    </div>
  );
}