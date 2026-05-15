'use client';
import style from './toaster.module.css';
import { useToast } from '@/_contexts/toastContext';

const ICONS = {
    success: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    error: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    warning: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    loading: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={style.spin}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
};

function Toast({toast, dimiss, index}) {
    const type = toast.type ?? 'default';
    const isStacked = index > 0;
    
    return (
        <div className={`${style.toast} ${style[type]} ${toast.removing ? style.removing: ""} ${isStacked ? style.stacked : ""}`}
            style={{'zIndex': index}}
            role='alert'
            aria-live= 'polite'
        >
            {toast.duration !== Infinity && !toast.removing && (
                <div
                    className={style.progress}
                    style={{animationDuration: `${toast.duration ?? 4000}`}}
                />
            )}
            <div className={style.inner}>
                {type !== 'default' && (
                    <span className={`${style.icon} ${style[`icon_${type}`]}`}>
                        {ICONS[type]}
                    </span>
                )}
            </div>
            
            <div className={style.body}>
                {toast.title && <p className={style.title}>{toast.title}</p>}
                <p className={style.message}>{toast.message}</p>
                
                {toast.action && (
                    <button
                        className={style.action}
                        onClick={() => {
                            toast.action.onClick?.();
                            dimiss(Toast.id);
                        }}
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>
            
            <button
                className={style.close}
                onClick={() => dimiss(toast.id)}
                aria-label='Cerrar notificacion'
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}

export function Toaster({position = 'bottom-right'}) {
    const {toasts, dimiss} = useToast();
    
    return (
        <div 
            className={`${style.toaster} ${style[position]}`}
            aria-label='Notificaciones'
        >
            {toasts.map((toast, index) => (
                <Toast key={toast.id} toast={toast} dimiss={dimiss} index={index}/>
            ))}
        </div>
    );
}