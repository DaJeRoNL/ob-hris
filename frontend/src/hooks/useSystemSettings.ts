import { useState, useEffect } from 'react';
import { getSystemConfig, SystemConfig } from '../utils/dashboardConfig';

export function useSystemSettings() {
    const [config, setConfig] = useState<SystemConfig>(getSystemConfig());

    useEffect(() => {
        const handleUpdate = () => setConfig(getSystemConfig());
        window.addEventListener('sys-config-updated', handleUpdate);
        return () => window.removeEventListener('sys-config-updated', handleUpdate);
    }, []);

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const format = config.settings.dateFormat;
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();

        switch(format) {
            case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
            case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
            case 'MM/DD/YYYY': default: return `${month}/${day}/${year}`;
        }
    };

    return {
        settings: config.settings,
        formatDate,
        currency: config.settings.currency
    };
}