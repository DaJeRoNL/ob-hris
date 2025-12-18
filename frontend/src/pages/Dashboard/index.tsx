import { 
    TrendUp, Users, CalendarCheck, CurrencyDollar, 
    CaretRight, Clock 
} from '@phosphor-icons/react';

// Mock Widget Component
const StatCard = ({ title, value, sub, icon: Icon, trend }: any) => (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <Icon size={24} weight="duotone" />
            </div>
            {trend && (
                <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendUp weight="bold" /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-black text-[var(--color-text)] mb-1">{value}</h3>
        <p className="text-sm opacity-60 font-medium">{title}</p>
        <div className="text-xs opacity-40 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            {sub}
        </div>
    </div>
);

const ActivityItem = ({ user, action, time }: any) => (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xs">
            {user.charAt(0)}
        </div>
        <div className="flex-1">
            <div className="text-sm font-bold text-[var(--color-text)]">
                {user} <span className="font-normal opacity-70">{action}</span>
            </div>
            <div className="text-[10px] opacity-40 font-medium flex items-center gap-1">
                <Clock size={10} /> {time}
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-fade-in bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-500">
            
            {/* WELCOME HEADER */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black font-['Montserrat'] mb-2">Dashboard</h1>
                    <p className="opacity-60 font-medium">Overview of system performance and HR activities.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-[var(--color-surface)] rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                    </div>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Total Employees" 
                    value="1,248" 
                    sub="12 New this month" 
                    icon={Users} 
                    trend="+2.4%" 
                />
                <StatCard 
                    title="Attendance Rate" 
                    value="96%" 
                    sub="Avg. check-in: 08:52 AM" 
                    icon={CalendarCheck} 
                    trend="+0.8%" 
                />
                <StatCard 
                    title="Open Positions" 
                    value="18" 
                    sub="4 Urgent (Engineering)" 
                    icon={CaretRight} 
                />
                <StatCard 
                    title="Payroll (Est)" 
                    value="$842k" 
                    sub="Next run: Oct 30th" 
                    icon={CurrencyDollar} 
                />
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LARGE CHART AREA */}
                <div className="lg:col-span-2 bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-sm min-h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lg">Recruitment Analytics</h3>
                        <select className="bg-gray-100 dark:bg-white/5 border-none text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    
                    {/* Fake Chart Visualization */}
                    <div className="flex items-end justify-between h-64 gap-2 px-4">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] transition-all rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold opacity-40 uppercase tracking-widest px-4">
                        <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div className="bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
                    <div className="space-y-2">
                        <ActivityItem user="Sarah J." action="submitted a leave request" time="12 min ago" />
                        <ActivityItem user="Mike T." action="completed onboarding" time="45 min ago" />
                        <ActivityItem user="System" action="completed daily backup" time="2 hours ago" />
                        <ActivityItem user="Amanda B." action="updated profile" time="3 hours ago" />
                        <ActivityItem user="John D." action="added a new ticket" time="5 hours ago" />
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition">
                        View Full Log
                    </button>
                </div>
            </div>
        </div>
    );
}
