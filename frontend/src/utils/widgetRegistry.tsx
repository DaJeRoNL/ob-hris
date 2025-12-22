// frontend/src/utils/widgetRegistry.tsx
import { FC } from 'react';
import RevenueWidget from '../pages/Dashboard/components/RevenueWidget';
import TalentWidget from '../pages/Dashboard/components/TalentWidget';
import LiveFeed from '../pages/Dashboard/components/LiveFeed';
import ExecutiveSummary from '../pages/Dashboard/components/ExecutiveSummary';
import GlobalContextWidget from '../pages/Dashboard/components/GlobalContextWidget';

// Define the shape of data that is passed to every widget
export interface DashboardDataProps {
    metrics: any[];          // Replace `any` with your actual MetricItem type
    pipeline: any[];         // Replace with PipelineStat[]
    activityFeed: any[];     // Replace with ActivityItem[]
    financialTrends: any[];  // Replace with FinancialMetric[]
    countryStats: any[];     // Replace with CountryStat[]
}

// Fully typed widget definition
export interface WidgetDefinition {
    id: string;
    title: string;
    description: string;
    component: FC<DashboardDataProps>; // now strictly typed
    minW: number;
    minH: number;
    permissionReq?: string; // Optional permission key
}

// Widget registry
export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
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
    talent_pipeline: {
        id: 'talent_pipeline',
        title: 'Talent Pipeline',
        description: 'Active candidates by recruitment stage.',
        component: (props: DashboardDataProps) => <TalentWidget pipeline={props.pipeline} />,
        minW: 2,
        minH: 2,
        permissionReq: 'view_hiring'
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
    global_map: {
        id: 'global_map',
        title: 'Global Presence',
        description: 'Map of active regions and employee distribution.',
        component: (props: DashboardDataProps) => <GlobalContextWidget countryStats={props.countryStats} />,
        minW: 2,
        minH: 1,
        permissionReq: 'view_global'
    }
};
