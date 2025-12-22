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
    permissions: string[]; // List of allowed actions/views
    defaultLayout: string[]; // List of widget IDs
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
            permissions: ['view_stats', 'view_finance', 'view_hiring', 'view_activity', 'view_global', 'view_ai'],
            defaultLayout: ['stats_summary', 'revenue_chart', 'talent_pipeline', 'global_map', 'live_feed'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Executive': {
            permissions: ['view_stats', 'view_finance', 'view_hiring', 'view_activity', 'view_global', 'view_ai'],
            defaultLayout: ['stats_summary', 'revenue_chart', 'talent_pipeline'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Manager': {
            permissions: ['view_stats', 'view_hiring', 'view_activity', 'view_global'],
            defaultLayout: ['stats_summary', 'talent_pipeline', 'live_feed'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'HR_Admin': {
            permissions: ['view_stats', 'view_hiring', 'view_activity', 'view_ai'],
            defaultLayout: ['stats_summary', 'talent_pipeline', 'live_feed'],
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, tasks: true, admin: true }
        },
        'Employee': {
            permissions: ['view_activity'],
            defaultLayout: ['live_feed'],
            tabs: { dashboard: true, people: false, hiring: false, time: true, finance: false, growth: false, compliance: false, docs: true, chat: true, tasks: true, admin: true }
        }
    }
};

const STORAGE_KEY = 'ob_hris_config_v7'; // Incremented version
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
    // Reset user custom layout when role changes to simulate new user
    localStorage.removeItem(USER_LAYOUT_KEY);
    window.dispatchEvent(new Event('role-updated'));
};

// New: Get/Set User's Custom Layout
export const getUserLayout = (role: UserRole): string[] => {
    const saved = localStorage.getItem(USER_LAYOUT_KEY);
    if (saved) return JSON.parse(saved);
    
    // Fallback to role default
    const config = getSystemConfig();
    return config.layout[role]?.defaultLayout || [];
};

export const saveUserLayout = (layout: string[]) => {
    localStorage.setItem(USER_LAYOUT_KEY, JSON.stringify(layout));
    window.dispatchEvent(new Event('layout-updated'));
};