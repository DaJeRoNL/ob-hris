import { useMemo, useState, useEffect } from 'react';
import { MOCK_DB } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
// Ensure dashboardConfig.ts has been updated with these exports!
import { getSystemConfig, getCurrentRole, getUserLayout } from '../utils/dashboardConfig';
import { ActivityItem, MetricItem, PipelineStat, FinancialMetric } from '../types';

export function useDashboardData() {
    const { currentClientId } = useAuth();
    const [userRole, setUserRole] = useState(getCurrentRole());
    // Initialize layout from the new helper
    const [layout, setLayout] = useState<string[]>(() => getUserLayout(getCurrentRole()));
    const [config, setConfig] = useState(getSystemConfig());

    useEffect(() => {
        const handleUpdate = () => { 
            const role = getCurrentRole();
            setUserRole(role);
            setLayout(getUserLayout(role));
            setConfig(getSystemConfig());
        };
        
        // Listen for all relevant system events
        window.addEventListener('sys-config-updated', handleUpdate);
        window.addEventListener('role-updated', handleUpdate);
        window.addEventListener('layout-updated', handleUpdate);
        
        return () => { 
            window.removeEventListener('sys-config-updated', handleUpdate); 
            window.removeEventListener('role-updated', handleUpdate);
            window.removeEventListener('layout-updated', handleUpdate);
        };
    }, []);

    // --- DATA AGGREGATION ---
    const clientPeople = useMemo(() => MOCK_DB.people.filter(p => p.clientId === currentClientId), [currentClientId]);
    const clientHiring = useMemo(() => MOCK_DB.hiring.filter(h => h.clientId === currentClientId), [currentClientId]);
    const clientFinance = useMemo(() => MOCK_DB.finance.filter(f => f.clientId === currentClientId), [currentClientId]);
    const currentClient = useMemo(() => MOCK_DB.clients.find(c => c.id === currentClientId), [currentClientId]);

    const metrics: MetricItem[] = useMemo(() => {
        const headcount = clientPeople.length;
        const payrollRaw = clientFinance.reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")) || 0), 0);
        const payrollFmt = (payrollRaw / 1000).toFixed(1) + 'k';
        const safeUsers = clientPeople.filter(p => p.visa === 'Citizen').length;
        const complianceScore = headcount > 0 ? Math.round((safeUsers / headcount) * 100) : 100;

        return [
            { label: 'Total Workforce', value: headcount, trend: 4, trendLabel: 'vs last month', linkTo: '/people', color: 'indigo' },
            { label: 'Total Spend', value: payrollFmt, trend: 12, trendLabel: 'expansion costs', isCurrency: true, linkTo: '/finance', color: 'emerald' },
            { label: 'Compliance Health', value: `${complianceScore}%`, trend: complianceScore < 90 ? -5 : 0, trendLabel: 'audit readiness', linkTo: '/compliance', color: complianceScore < 90 ? 'rose' : 'blue' },
            { label: 'Active Pipeline', value: clientHiring.length, trend: 8, trendLabel: 'open reqs', linkTo: '/hiring', color: 'amber' },
        ];
    }, [clientPeople, clientFinance, clientHiring]);

    const financialTrends: FinancialMetric[] = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({ day, revenue: 60 + Math.random() * 25, expense: 45 + Math.random() * 15 }));
    }, []);

    const pipeline: PipelineStat[] = useMemo(() => {
        const stages = ['Screening', 'Interview', 'Offer'];
        return stages.map(stage => ({ stage, count: clientHiring.filter(h => h.stage === stage).length, candidates: clientHiring.filter(h => h.stage === stage).map(c => ({ name: c.name, role: c.role })) }));
    }, [clientHiring]);

    const activityFeed: ActivityItem[] = useMemo(() => {
        const feed: ActivityItem[] = [];
        clientPeople.slice(-2).forEach((p, i) => feed.push({ id: `hire-${p.id}`, user: 'System', action: 'Onboarded', target: p.name, time: `${i + 2}h ago`, category: 'hr' }));
        clientFinance.slice(-2).forEach((f, i) => feed.push({ id: `fin-${f.id}`, user: 'Finance Bot', action: f.status === 'Paid' ? 'Processed' : 'Flagged', target: `Invoice ${f.id}`, time: `${i + 5}h ago`, category: 'finance', priority: f.status === 'Pending' ? 'high' : 'normal' }));
        if (feed.length < 3) feed.push({ id: 'sys-1', user: 'Admin', action: 'Updated', target: 'Security Policy', time: '2d ago', category: 'system' });
        return feed.sort((a,b) => a.time.localeCompare(b.time));
    }, [clientPeople, clientFinance]);

    const countryStats = useMemo(() => {
        const counts: Record<string, number> = {};
        clientPeople.forEach(p => { counts[p.loc] = (counts[p.loc] || 0) + 1; });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
    }, [clientPeople]);

    return { 
        metrics, 
        pipeline, 
        activityFeed, 
        financialTrends, 
        countryStats, 
        clientName: currentClient?.name || 'Unknown',
        layout, // The new layout array
        userRole,
        // Safe access to permissions
        permissions: config.layout[userRole]?.permissions || []
    };
}