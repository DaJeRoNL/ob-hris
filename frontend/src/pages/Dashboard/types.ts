export interface MetricItem {
    label: string;
    value: string | number;
    trend: number;
    trendLabel: string;
    isCurrency?: boolean;
    linkTo?: string;
    color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'purple';
}

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    category: 'hr' | 'finance' | 'system' | 'compliance' | 'hiring';
    priority?: 'high' | 'normal';
}

export interface PipelineStat {
    stage: string;
    count: number;
    candidates: { name: string; role: string }[];
}

export interface FinancialMetric {
    day: string;
    revenue: number;
    expense: number;
}