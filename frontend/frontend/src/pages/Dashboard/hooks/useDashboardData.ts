import { useMemo } from 'react';
import { MOCK_DB } from '../../../utils/mockData';
import { useAuth } from '../../../context/AuthContext';
import { ActivityItem, MetricItem, PipelineStat } from '../types';

export function useDashboardData() {
    const { currentClientId } = useAuth();

    // 1. Filter Data by Context
    const clientPeople = useMemo(() => MOCK_DB.people.filter(p => p.clientId === currentClientId), [currentClientId]);
    const clientHiring = useMemo(() => MOCK_DB.hiring.filter(h => h.clientId === currentClientId), [currentClientId]);
    const clientFinance = useMemo(() => MOCK_DB.finance.filter(f => f.clientId === currentClientId), [currentClientId]);
    const currentClient = useMemo(() => MOCK_DB.clients.find(c => c.id === currentClientId), [currentClientId]);

    // 2. Metrics Calculation
    const metrics: MetricItem[] = useMemo(() => {
        // Headcount
        const headcount = clientPeople.length;
        
        // Payroll: Sum actual 'Paid' and 'Pending' invoices to simulate spend
        const payrollRaw = clientFinance.reduce((acc, curr) => {
            const val = parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")) || 0;
            return acc + val;
        }, 0);
        const payrollFmt = (payrollRaw / 1000).toFixed(1) + 'k';

        // Compliance: Calculate based on Visa types
        const safeUsers = clientPeople.filter(p => p.visa === 'Citizen').length;
        const complianceScore = headcount > 0 ? Math.round((safeUsers / headcount) * 100) : 100;

        return [
            { 
                label: 'Total Workforce', 
                value: headcount, 
                trend: 4, 
                trendLabel: 'vs last month', 
                linkTo: '/people',
                color: 'indigo'
            },
            { 
                label: 'Total Spend', 
                value: payrollFmt, 
                trend: 12, 
                trendLabel: 'due to expansion', 
                isCurrency: true, 
                linkTo: '/finance',
                color: 'emerald'
            },
            { 
                label: 'Compliance Health', 
                value: `${complianceScore}%`, 
                trend: complianceScore < 90 ? -5 : 0, 
                trendLabel: 'audit readiness', 
                linkTo: '/compliance',
                color: complianceScore < 90 ? 'rose' : 'blue'
            },
            { 
                label: 'Active Pipeline', 
                value: clientHiring.length, 
                trend: clientHiring.length > 2 ? 8 : 0, 
                trendLabel: 'open reqs', 
                linkTo: '/hiring',
                color: 'amber'
            },
        ];
    }, [clientPeople, clientFinance, clientHiring]);

    // 3. Pipeline Stats
    const pipeline: PipelineStat[] = useMemo(() => {
        const stages = ['Screening', 'Interview', 'Offer'];
        return stages.map(stage => ({
            stage,
            count: clientHiring.filter(h => h.stage === stage).length,
            candidates: clientHiring.filter(h => h.stage === stage).map(c => ({ name: c.name, role: c.role }))
        }));
    }, [clientHiring]);

    // 4. "Smart" Activity Feed (Derived from actual data + simulated recent events)
    const activityFeed: ActivityItem[] = useMemo(() => {
        const feed: ActivityItem[] = [];

        // Add recent hires
        clientPeople.slice(-2).forEach((p, i) => {
            feed.push({ 
                id: `hire-${p.id}`, 
                user: 'System', 
                action: 'Onboarded', 
                target: p.name, 
                time: `${i + 2}h ago`, 
                category: 'hr' 
            });
        });

        // Add finance events
        clientFinance.slice(-2).forEach((f, i) => {
            feed.push({ 
                id: `fin-${f.id}`, 
                user: 'Finance Bot', 
                action: f.status === 'Paid' ? 'Processed' : 'Flagged', 
                target: `Invoice ${f.id}`, 
                time: `${i + 5}h ago`, 
                category: 'finance',
                priority: f.status === 'Pending' ? 'high' : 'normal'
            });
        });

        // Add hiring movement
        clientHiring.slice(-2).forEach((h, i) => {
            feed.push({
                id: `hiring-${h.id}`,
                user: 'Recruiting',
                action: 'Moved Candidate',
                target: h.name,
                time: '1d ago',
                category: 'hiring'
            });
        });

        // Filler System events if empty
        if (feed.length < 3) {
            feed.push({ id: 'sys-1', user: 'Admin', action: 'Updated', target: 'Security Policy', time: '2d ago', category: 'system' });
        }

        return feed.sort((a,b) => a.time.localeCompare(b.time)); // Rough sort
    }, [clientPeople, clientFinance, clientHiring]);

    return {
        metrics,
        pipeline,
        activityFeed,
        people: clientPeople,
        clientName: currentClient?.name || 'Unknown'
    };
}