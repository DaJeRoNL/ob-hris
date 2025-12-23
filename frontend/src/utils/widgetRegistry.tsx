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
import { StickyNotesWidget, MyTodayWidget, MyTasksWidget, TimeSnapshotWidget } from '../pages/Dashboard/components/PersonalWidgets';
import { TeamAvailabilityWidget, TeamWorkloadWidget, TeamAlertsWidget, UpcomingEventsWidget } from '../pages/Dashboard/components/ManagerWidgets';
import { DocExpiryWidget, OnboardingProgressWidget, HeadcountBreakdownWidget, ComplianceStatusWidget } from '../pages/Dashboard/components/HRWidgets';
import { PayrollSnapshotWidget, AttritionWidget } from '../pages/Dashboard/components/ExecutiveWidgets';
import { AnnouncementsWidget, CelebrationsWidget } from '../pages/Dashboard/components/CommunicationWidgets';
import { QuickLookupWidget, QuickLinksWidget } from '../pages/Dashboard/components/UtilityWidgets';

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
    // New Props
    hrMetrics: any;
    payrollData: any;
    announcements: any[];
    upcomingEvents: any[];
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
    payroll_snapshot: {
        id: 'payroll_snapshot',
        title: 'Payroll Snapshot',
        description: 'Monthly payroll trends and breakdown.',
        component: (props: DashboardDataProps) => <PayrollSnapshotWidget data={props.payrollData} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_finance'
    },
    attrition_overview: {
        id: 'attrition_overview',
        title: 'Attrition Overview',
        description: 'Employee turnover rates and trends.',
        component: (props: DashboardDataProps) => <AttritionWidget data={props.hrMetrics.attrition} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hr_metrics'
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
        minW: 3, // WIDER
        minH: 2,
        permissionReq: 'view_global'
    },

    // --- HR / COMPLIANCE ---
    talent_pipeline: {
        id: 'talent_pipeline',
        title: 'Talent Pipeline',
        description: 'Active candidates by recruitment stage.',
        component: (props: DashboardDataProps) => <TalentWidget pipeline={props.pipeline} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hiring'
    },
    onboarding_progress: {
        id: 'onboarding_progress',
        title: 'Onboarding Progress',
        description: 'Status of new hires and their checklists.',
        component: (props: DashboardDataProps) => <OnboardingProgressWidget data={props.hrMetrics.onboarding} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hr_metrics'
    },
    doc_expiry: {
        id: 'doc_expiry',
        title: 'Document Expiry',
        description: 'Track expiring contracts and visas.',
        component: (props: DashboardDataProps) => <DocExpiryWidget data={props.hrMetrics.expiringDocs} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hr_metrics'
    },
    headcount_breakdown: {
        id: 'headcount_breakdown',
        title: 'Headcount Breakdown',
        description: 'Distribution by department and contract.',
        component: (props: DashboardDataProps) => <HeadcountBreakdownWidget data={props.hrMetrics.headcount} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hr_metrics'
    },
    compliance_status: {
        id: 'compliance_status',
        title: 'Compliance Status',
        description: 'Overall compliance health and missing items.',
        component: (props: DashboardDataProps) => <ComplianceStatusWidget data={props.hrMetrics.compliance} />,
        minW: 1,
        minH: 2,
        permissionReq: 'view_hr_metrics'
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
    team_alerts: {
        id: 'team_alerts',
        title: 'Team Alerts',
        description: 'Flags for missing timesheets and approvals.',
        component: (props: DashboardDataProps) => <TeamAlertsWidget />,
        minW: 1,
        minH: 1,
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
    upcoming_events: {
        id: 'upcoming_events',
        title: 'Upcoming Team Events',
        description: 'Birthdays and work anniversaries.',
        component: (props: DashboardDataProps) => <UpcomingEventsWidget events={props.upcomingEvents} />,
        minW: 1,
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
    time_snapshot: {
        id: 'time_snapshot',
        title: 'Time Snapshot',
        description: 'Track your daily hours.',
        component: (props: DashboardDataProps) => <TimeSnapshotWidget />,
        minW: 1,
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

    // --- COMMUNICATION & UTILITY ---
    announcements: {
        id: 'announcements',
        title: 'Announcements',
        description: 'Latest company news.',
        component: (props: DashboardDataProps) => <AnnouncementsWidget items={props.announcements} />,
        minW: 2,
        minH: 1,
    },
    celebrations: {
        id: 'celebrations',
        title: 'Celebrations',
        description: 'Birthdays and new hires.',
        component: (props: DashboardDataProps) => <CelebrationsWidget events={props.upcomingEvents} />,
        minW: 1,
        minH: 1,
    },
    quick_lookup: {
        id: 'quick_lookup',
        title: 'Employee Lookup',
        description: 'Fast search for team members.',
        component: (props: DashboardDataProps) => <QuickLookupWidget />,
        minW: 1,
        minH: 1,
    },
    quick_links: {
        id: 'quick_links',
        title: 'Quick Links',
        description: 'Customizable bookmarks.',
        component: (props: DashboardDataProps) => <QuickLinksWidget />,
        minW: 1,
        minH: 1,
    },
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