interface Props {
    status: string;
    type?: 'success' | 'warning' | 'danger' | 'info';
}

export default function StatusPill({ status, type = 'info' }: Props) {
    let classes = '';
    switch(type) {
        case 'success': classes = 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20'; break;
        case 'warning': classes = 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20'; break;
        case 'danger': classes = 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20'; break;
        default: classes = 'bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20'; break;
    }

    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${classes}`}>
            {status}
        </span>
    );
}