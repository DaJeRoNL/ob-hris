import { User, Robot, Alien, Detective } from '@phosphor-icons/react';

interface Props {
    avatarId: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function UserAvatar({ avatarId, size = 'md', className = '' }: Props) {
    
    // Dimension mapping
    const dims = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-24 h-24 text-4xl',
        xl: 'w-32 h-32 text-5xl'
    };

    // Render logic
    const renderContent = () => {
        switch(avatarId) {
            case 'gradient-1': return <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">SA</div>;
            case 'gradient-2': return <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-bold">SA</div>;
            case 'gradient-3': return <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold">SA</div>;
            case 'robot': return <div className="w-full h-full bg-slate-800 flex items-center justify-center text-blue-400"><Robot weight="duotone" className="w-3/5 h-3/5" /></div>;
            case 'alien': return <div className="w-full h-full bg-green-900 flex items-center justify-center text-green-400"><Alien weight="duotone" className="w-3/5 h-3/5" /></div>;
            case 'spy': return <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-400"><Detective weight="duotone" className="w-3/5 h-3/5" /></div>;
            default: return <div className="w-full h-full bg-[var(--color-primary)] flex items-center justify-center text-white"><User weight="bold" className="w-3/5 h-3/5" /></div>;
        }
    };

    return (
        <div className={`${dims[size]} rounded-full overflow-hidden shadow-lg border-2 border-[var(--color-surface)] ${className}`}>
            {renderContent()}
        </div>
    );
}