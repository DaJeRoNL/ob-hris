export type UserRole = 'System Admin' | 'Executive' | 'Manager' | 'HR_Admin' | 'Employee';

export interface TabConfig {
    dashboard: boolean;
    people: boolean;
    hiring: boolean;
    time: boolean;
    finance: boolean;
    growth: boolean;
    compliance: boolean;
    docs: boolean;
    chat: boolean;
    tasks: boolean;
    admin: boolean;
}

export interface RoleConfig {
    permissions: string[];
    defaultLayout: string[];
    tabs: TabConfig;
}

export interface GeneralSettings {
    dateFormat: string;
    currency: string;
    systemName: string;
    mfaEnabled: boolean;
    sessionTimeout: string;
    dataRetention: string;
    maintenanceMode: boolean;
}

export interface SystemConfig {
    layout: {
        [key in UserRole]: RoleConfig;
    };
    settings: GeneralSettings;
}

const DEFAULT_CONFIG: SystemConfig = {
    settings: {
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        systemName: 'PB // HRIS',
        mfaEnabled: false,
        sessionTimeout: '30m',
        dataRetention: '1 Year',
        maintenanceMode: false
    },
    layout: {
        'System Admin': {
            permissions: ['view_stats', 'view_finance', 'view_hiring', 'view_activity', 'view_global', 'view_ai', 'view_team', 'view_approvals', 'view_tasks', 'view_hr_metrics'],
            defaultLayout: ['stats_summary', 'global_map', 'my_today', 'announcements', 'payroll_snapshot', 'headcount_breakdown', 'revenue_chart', 'compliance_status'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Executive': {
            permissions: ['view_stats', 'view_finance', 'view_hiring', 'view_activity', 'view_global', 'view_ai', 'view_approvals'],
            defaultLayout: ['stats_summary', 'global_map', 'payroll_snapshot', 'attrition_overview', 'revenue_chart', 'talent_pipeline'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Manager': {
            permissions: ['view_stats', 'view_hiring', 'view_activity', 'view_global', 'view_team', 'view_approvals', 'view_tasks'],
            defaultLayout: ['stats_summary', 'team_availability', 'team_alerts', 'upcoming_events', 'my_today', 'my_tasks'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'HR_Admin': {
            permissions: ['view_stats', 'view_hiring', 'view_activity', 'view_ai', 'view_team', 'view_tasks', 'view_hr_metrics'],
            defaultLayout: ['stats_summary', 'onboarding_progress', 'doc_expiry', 'compliance_status', 'headcount_breakdown', 'upcoming_events'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Employee': {
            permissions: ['view_activity', 'view_team', 'view_tasks'],
            defaultLayout: ['my_today', 'time_snapshot', 'announcements', 'celebrations', 'quick_links', 'my_tasks'],
            tabs: { dashboard: true, people: false, hiring: false, time: true, finance: false, growth: false, compliance: false, docs: true, chat: true, tasks: true, admin: true }
        }
    }
};

const STORAGE_KEY = 'ob_hris_config_v10'; // Incremented version
const ROLE_KEY = 'ob_hris_active_role';
const USER_LAYOUT_KEY = 'ob_hris_user_layout';

export const getSystemConfig = (): SystemConfig => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CONFIG;
    const parsed = JSON.parse(saved);
    return { 
        settings: { ...DEFAULT_CONFIG.settings, ...parsed.settings },
        layout: { ...DEFAULT_CONFIG.layout, ...parsed.layout }
    };
};

export const saveSystemConfig = (config: SystemConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('sys-config-updated'));
};

export const getCurrentRole = (): UserRole => {
    return (localStorage.getItem(ROLE_KEY) as UserRole) || 'System Admin';
};

export const setCurrentRole = (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
    localStorage.removeItem(USER_LAYOUT_KEY);
    window.dispatchEvent(new Event('role-updated'));
};

export const getUserLayout = (role: UserRole): string[] => {
    const saved = localStorage.getItem(USER_LAYOUT_KEY);
    if (saved) return JSON.parse(saved);
    const config = getSystemConfig();
    return config.layout[role]?.defaultLayout || [];
};

export const saveUserLayout = (layout: string[]) => {
    localStorage.setItem(USER_LAYOUT_KEY, JSON.stringify(layout));
    window.dispatchEvent(new Event('layout-updated'));
};