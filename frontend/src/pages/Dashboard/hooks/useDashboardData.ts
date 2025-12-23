import { useMemo, useState, useEffect } from 'react';
import { MOCK_DB } from '../../../utils/mockData';
import { useAuth } from '../../../context/AuthContext';
import { getSystemConfig, SystemConfig, getCurrentRole, getUserLayout } from '../../../utils/dashboardConfig';
import { ActivityItem, MetricItem, PipelineStat, FinancialMetric } from '../types';

export function useDashboardData() {
    const { currentClientId } = useAuth();
    const [config, setConfig] = useState<SystemConfig>(() => getSystemConfig());
    const [userRole, setUserRole] = useState(getCurrentRole());
    
    const [layoutConfig, setLayoutConfig] = useState<string[]>(() => {
        const layout = getUserLayout(getCurrentRole());
        return Array.isArray(layout) ? layout : []; 
    });

    useEffect(() => {
        const handleUpdate = () => { 
            const role = getCurrentRole();
            setConfig(getSystemConfig()); 
            setUserRole(role);
            const newLayout = getUserLayout(role);
            setLayoutConfig(Array.isArray(newLayout) ? newLayout : []);
        };
        window.addEventListener('sys-config-updated', handleUpdate);
        window.addEventListener('role-updated', handleUpdate);
        window.addEventListener('layout-updated', handleUpdate);
        return () => { 
            window.removeEventListener('sys-config-updated', handleUpdate); 
            window.removeEventListener('role-updated', handleUpdate);
            window.removeEventListener('layout-updated', handleUpdate);
        };
    }, []);

    // --- CORE DATA ---
    const clientPeople = useMemo(() => MOCK_DB.people.filter(p => p.clientId === currentClientId), [currentClientId]);
    const clientHiring = useMemo(() => MOCK_DB.hiring.filter(h => h.clientId === currentClientId), [currentClientId]);
    const clientFinance = useMemo(() => MOCK_DB.finance.filter(f => f.clientId === currentClientId), [currentClientId]);
    const currentClient = useMemo(() => MOCK_DB.clients.find(c => c.id === currentClientId), [currentClientId]);

    // --- HR METRICS ---
    const hrMetrics = useMemo(() => {
        const onboarding = clientPeople.filter(p => p.status === 'Onboarding').map(p => ({
            id: p.id, name: p.name, role: p.role, progress: Math.floor(Math.random() * 80) + 10
        }));
        
        const expiringDocs = clientPeople.filter(p => p.visa !== 'Citizen').map(p => ({
            id: p.id, name: p.name, docType: p.visa, daysLeft: Math.floor(Math.random() * 90) + 5
        })).sort((a,b) => a.daysLeft - b.daysLeft).slice(0, 5);

        const deptCounts = clientPeople.reduce((acc, p) => {
            const dept = p.role.split(' ')[1] || 'General'; 
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const headcount = Object.entries(deptCounts).map(([dept, count]) => ({ dept, count }));

        return {
            onboarding,
            expiringDocs,
            headcount,
            attrition: { monthly: 2.1, quarterly: 5.4, trend: 'down' },
            compliance: { score: 94, pending: expiringDocs.length }
        };
    }, [clientPeople]);

    // --- PAYROLL DATA ---
    const payrollData = useMemo(() => {
        const total = clientFinance.reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")) || 0), 0);
        return { total: total * 1.2, change: 4.5, history: [40, 42, 41, 45, 48, 50] }; // Mock history
    }, [clientFinance]);

    // --- COMMUNICATION ---
    const announcements = useMemo(() => [
        { id: 1, title: 'Q4 All Hands Meeting', date: 'Oct 24', author: 'CEO' },
        { id: 2, title: 'New Benefits Enrollment', date: 'Oct 20', author: 'HR' },
        { id: 3, title: 'Office Closure (Holiday)', date: 'Oct 15', author: 'Admin' },
    ], []);

    const upcomingEvents = useMemo(() => {
        return clientPeople.slice(0, 3).map((p, i) => ({
            id: p.id,
            name: p.name,
            type: i % 2 === 0 ? 'Birthday' : 'Work Anniversary',
            date: new Date(Date.now() + (i + 1) * 86400000 * 3).toLocaleDateString([], {month:'short', day:'numeric'})
        }));
    }, [clientPeople]);

    // --- TEAM STATUS ---
    const teamStatus = useMemo(() => {
        return clientPeople.map(p => {
            const r = p.name.length % 3;
            const status = r === 0 ? 'Online' : r === 1 ? 'In Meeting' : 'Offline';
            return {
                id: p.id, name: p.name, role: p.role, avatar: p.name.charAt(0),
                status: status as 'Online' | 'In Meeting' | 'Offline'
            };
        }).slice(0, 6);
    }, [clientPeople]);

    // --- PENDING TASKS ---
    const pendingTasks = useMemo(() => {
        // FIX: Explicitly typed to avoid implicit any error
        const items: { id: string; title: string; desc: string; type: string; priority: string; actionLink: string }[] = [];
        
        clientFinance.filter(f => f.status === 'Pending').forEach(i => items.push({
            id: i.id, title: `Approve Invoice ${i.id}`, desc: `${i.amount}`, type: 'Finance', priority: 'High', actionLink: '/finance'
        }));
        
        clientHiring.filter(h => h.stage === 'Offer').forEach(h => items.push({
            id: h.id, title: `Sign Offer: ${h.name}`, desc: h.role, type: 'Hiring', priority: 'Critical', actionLink: '/hiring'
        }));
        
        return items;
    }, [clientFinance, clientHiring]);

    // --- OTHER MOCKS ---
    const myTasks = useMemo(() => [
        { id: 't1', title: 'Review Q4 Budget', due: 'Today', status: 'Pending', tag: 'Finance' },
        { id: 't2', title: 'Onboard Sarah Connor', due: 'Tomorrow', status: 'In Progress', tag: 'HR' },
    ], []);

    const teamWorkload = useMemo(() => clientPeople.slice(0, 5).map(p => ({
        id: p.id, name: p.name, role: p.role, avatar: p.name.charAt(0),
        hours: Math.floor(Math.random() * 40) + 10, capacity: 40
    })), [clientPeople]);

    const financialTrends = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({ day, revenue: 60 + Math.random() * 25, expense: 45 + Math.random() * 15 }));
    }, []);

    const pipeline = useMemo(() => {
        const stages = ['Screening', 'Interview', 'Offer'];
        return stages.map(stage => ({ stage, count: clientHiring.filter(h => h.stage === stage).length, candidates: clientHiring.filter(h => h.stage === stage).map(c => ({ name: c.name, role: c.role })) }));
    }, [clientHiring]);

    const activityFeed = useMemo(() => {
        const feed: ActivityItem[] = [];
        clientPeople.slice(-2).forEach((p, i) => feed.push({ id: `hire-${p.id}`, user: 'System', action: 'Onboarded', target: p.name, time: `${i + 2}h ago`, category: 'hr' }));
        clientFinance.slice(-2).forEach((f, i) => feed.push({ id: `fin-${f.id}`, user: 'Finance Bot', action: f.status === 'Paid' ? 'Processed' : 'Flagged', target: `Invoice ${f.id}`, time: `${i + 5}h ago`, category: 'finance', priority: f.status === 'Pending' ? 'high' : 'normal' }));
        return feed.sort((a,b) => a.time.localeCompare(b.time));
    }, [clientPeople, clientFinance]);

    const countryStats = useMemo(() => {
        const counts: Record<string, number> = {};
        clientPeople.forEach(p => { counts[p.loc] = (counts[p.loc] || 0) + 1; });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);
    }, [clientPeople]);

    const metrics: MetricItem[] = useMemo(() => {
        const headcount = clientPeople.length;
        const complianceScore = 94;
        return [
            { label: 'Total Workforce', value: headcount, trend: 4, trendLabel: 'vs last month', linkTo: '/people', color: 'indigo' },
            { label: 'Compliance Health', value: `${complianceScore}%`, trend: 0, trendLabel: 'audit readiness', linkTo: '/compliance', color: 'blue' },
        ];
    }, [clientPeople]);

    return { 
        metrics, pipeline, activityFeed, financialTrends, countryStats, teamStatus, 
        pendingTasks, myTasks, teamWorkload, hrMetrics, payrollData, announcements, upcomingEvents,
        clientName: currentClient?.name || 'Unknown', 
        layoutConfig: layoutConfig || [],
        permissions: config.layout[userRole]?.permissions || []
    };
}