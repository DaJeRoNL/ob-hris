import { User, Envelope, Lock, Camera } from '@phosphor-icons/react';

export default function ProfileTab() {
    return (
        <div className="space-y-8 animate-fade-in max-w-3xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">My Profile</h2>
                <p className="opacity-60 text-sm">Manage your personal account details.</p>
            </div>

            {/* AVATAR SECTION */}
            <div className="bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm flex items-center gap-6">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        SA
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} weight="bold" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold">System Admin</h3>
                    <p className="opacity-60 text-sm mb-3">super.admin@company.com</p>
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        Active Session
                    </span>
                </div>
            </div>

            {/* FORM SECTION */}
            <div className="bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 block mb-2">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                            <input type="text" defaultValue="System" className="w-full bg-gray-50 dark:bg-[var(--color-surface)]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-medium outline-none focus:border-[var(--color-primary)] transition" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 block mb-2">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                            <input type="text" defaultValue="Admin" className="w-full bg-gray-50 dark:bg-[var(--color-surface)]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-medium outline-none focus:border-[var(--color-primary)] transition" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase opacity-60 block mb-2">Email Address</label>
                    <div className="relative">
                        <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                        <input type="email" defaultValue="super.admin@company.com" className="w-full bg-gray-50 dark:bg-[var(--color-surface)]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 font-medium outline-none focus:border-[var(--color-primary)] transition" />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                    <button className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-2 hover:underline">
                        <Lock weight="bold" /> Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
