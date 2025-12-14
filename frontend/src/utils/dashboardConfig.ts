export type UserRole = 'System Admin' | 'Executive' | 'Manager' | 'HR_Admin' | 'Employee';

export interface WidgetConfig {
    revenue: boolean;
    talent: boolean;
    feed: boolean;
    global: boolean;
    ai: boolean;
}

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
    admin: boolean;
}

export interface GeneralSettings {
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    currency: 'USD' | 'EUR' | 'GBP';
}

export interface RoleConfig {
    widgets: WidgetConfig;
    tabs: TabConfig;
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
        currency: 'USD'
    },
    layout: {
        'System Admin': {
            widgets: { revenue: true, talent: true, feed: true, global: true, ai: true },
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, admin: true }
        },
        'Executive': {
            widgets: { revenue: true, talent: true, feed: true, global: true, ai: true },
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: true, growth: true, compliance: true, docs: true, chat: true, admin: true }
        },
        'Manager': {
            widgets: { revenue: false, talent: true, feed: true, global: true, ai: false },
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, admin: false }
        },
        'HR_Admin': {
            widgets: { revenue: false, talent: true, feed: true, global: false, ai: true },
            tabs: { dashboard: true, people: true, hiring: true, time: true, finance: false, growth: false, compliance: true, docs: true, chat: true, admin: false }
        },
        'Employee': {
            widgets: { revenue: false, talent: false, feed: true, global: false, ai: false },
            tabs: { dashboard: true, people: false, hiring: false, time: true, finance: false, growth: false, compliance: false, docs: true, chat: true, admin: false }
        }
    }
};

const STORAGE_KEY = 'ob_hris_config_v4';
const ROLE_KEY = 'ob_hris_active_role';

export const getSystemConfig = (): SystemConfig => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CONFIG;
    const parsed = JSON.parse(saved);
    // Deep merge safe guard
    return { 
        settings: { ...DEFAULT_CONFIG.settings, ...parsed.settings },
        layout: { ...DEFAULT_CONFIG.layout, ...parsed.layout }
    };
};

export const saveSystemConfig = (config: SystemConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('sys-config-updated'));
};

export const resetSystemConfig = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('sys-config-updated'));
    return DEFAULT_CONFIG;
};

// Role Management
export const getCurrentRole = (): UserRole => {
    return (localStorage.getItem(ROLE_KEY) as UserRole) || 'System Admin';
};

export const setCurrentRole = (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
    window.dispatchEvent(new Event('role-updated'));
};