import { FC } from 'react';
import RevenueWidget from '../pages/Dashboard/components/RevenueWidget';
import TalentWidget from '../pages/Dashboard/components/TalentWidget';
import LiveFeed from '../pages/Dashboard/components/LiveFeed';
import ExecutiveSummary from '../pages/Dashboard/components/ExecutiveSummary';
import GlobalContextWidget from '../pages/Dashboard/components/GlobalContextWidget';
import TeamStatusWidget from '../pages/Dashboard/components/TeamStatusWidget';
import QuickActionsWidget from '../pages/Dashboard/components/QuickActionsWidget';
import PendingTasksWidget from '../pages/Dashboard/components/PendingTasksWidget';
// New Imports
import { StickyNotesWidget, MyTodayWidget, MyTasksWidget } from '../pages/Dashboard/components/PersonalWidgets';
import { TeamAvailabilityWidget, TeamWorkloadWidget } from '../pages/Dashboard/components/ManagerWidgets';

export interface DashboardDataProps {
    metrics: any[];
    pipeline: any[];
    activityFeed: any[];
    financialTrends: any[];
    countryStats: any[];
    teamStatus: any[];
    pendingTasks: any[];
    myTasks: any[];
    teamWorkload: any[];
}

export interface WidgetDefinition {
    id: string;
    title: string;
    description: string;
    component: FC<DashboardDataProps>;
    minW: number;
    minH: number;
    permissionReq?: string; 
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
    // --- EXECUTIVE / OWNER ---
    stats_summary: {
        id: 'stats_summary',
        title: 'Executive Summary',
        description: 'Key metrics for workforce, finance, and compliance.',
        component: (props: DashboardDataProps) => <ExecutiveSummary metrics={props.metrics} />,
        minW: 4,
        minH: 1,
        permissionReq: 'view_stats'
    },
    revenue_chart: {
        id: 'revenue_chart',
        title: 'Financial Overview',
        description: '7-day revenue vs expense trend analysis.',
        component: (props: DashboardDataProps) => <RevenueWidget data={props.financialTrends} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_finance'
    },
    global_map: {
        id: 'global_map',
        title: 'Global Presence',
        description: 'Map of active regions and employee distribution.',
        component: (props: DashboardDataProps) => <GlobalContextWidget countryStats={props.countryStats} />,
        minW: 3, // UPDATED: Wider by default
        minH: 2, // Taller to accommodate
        permissionReq: 'view_global'
    },

    // --- HR / HIRING ---
    talent_pipeline: {
        id: 'talent_pipeline',
        title: 'Talent Pipeline',
        description: 'Active candidates by recruitment stage.',
        component: (props: DashboardDataProps) => <TalentWidget pipeline={props.pipeline} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hiring'
    },

    // --- MANAGER / TEAM ---
    team_status: {
        id: 'team_status',
        title: 'Team Pulse (Simple)',
        description: 'Live view of team availability.',
        component: (props: DashboardDataProps) => <TeamStatusWidget members={props.teamStatus} />,
        minW: 1,
        minH: 2,
        permissionReq: 'view_team'
    },
    team_availability: {
        id: 'team_availability',
        title: 'Team Availability',
        description: 'Detailed view of who is online, away, or on leave.',
        component: (props: DashboardDataProps) => <TeamAvailabilityWidget members={props.teamStatus} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_team'
    },
    team_workload: {
        id: 'team_workload',
        title: 'Team Workload',
        description: 'Hours logged per team member this week.',
        component: (props: DashboardDataProps) => <TeamWorkloadWidget workload={props.teamWorkload} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_team'
    },

    // --- PERSONAL PRODUCTIVITY ---
    sticky_notes: {
        id: 'sticky_notes',
        title: 'Sticky Notes',
        description: 'Personal scratchpad for quick thoughts.',
        component: (props: DashboardDataProps) => <StickyNotesWidget />,
        minW: 1,
        minH: 1,
    },
    my_today: {
        id: 'my_today',
        title: 'My Today',
        description: 'Agenda, meetings, and quick stats.',
        component: (props: DashboardDataProps) => <MyTodayWidget />,
        minW: 2,
        minH: 1,
    },
    my_tasks: {
        id: 'my_tasks',
        title: 'My Tasks',
        description: 'Assigned tasks due soon.',
        component: (props: DashboardDataProps) => <MyTasksWidget tasks={props.myTasks} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_tasks'
    },
    quick_actions: {
        id: 'quick_actions',
        title: 'Quick Actions',
        description: 'Shortcuts for common tasks.',
        component: (props: DashboardDataProps) => <QuickActionsWidget />,
        minW: 1,
        minH: 1,
    },

    // --- UTILITY ---
    live_feed: {
        id: 'live_feed',
        title: 'Live Pulse',
        description: 'Real-time stream of system activities.',
        component: (props: DashboardDataProps) => <LiveFeed feed={props.activityFeed} />,
        minW: 1,
        minH: 3,
        permissionReq: 'view_activity'
    },
    pending_tasks: {
        id: 'pending_tasks',
        title: 'Pending Approvals',
        description: 'Approvals requiring immediate attention.',
        component: (props: DashboardDataProps) => <PendingTasksWidget tasks={props.pendingTasks} />,
        minW: 1,
        minH: 2,
        permissionReq: 'view_approvals'
    }
};