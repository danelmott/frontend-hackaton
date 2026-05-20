'use client';
import { useToast } from '@/_contexts/toastContext';
import style from './toaster.module.css';
import { Icon } from '../icon/icon';

function Toast({ toast, dismiss }) {
    const type = toast.type ?? 'default';
    
    return (
        <div
            className={`${style.toast} ${style[type]} ${toast.removing ? style.removing : ''}`}
            role="alert"
            aria-live="polite"
        >
            {toast.duration !== Infinity && !toast.removing && (
                <div
                    className={`${style.progress} ${style[`progress_${type}`]}`}
                    style={{ animationDuration: `${toast.duration ?? 4000}ms` }}
                />
            )}
            <span className={style.dot} aria-hidden="true" />
            <p className={style.message}>{toast.message}</p>
            <button
                className={style.close}
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
            >
                <Icon name='close' size='md'/>
            </button>
        </div>
    );
}

export function Toaster({ position = 'bottom-right' }) {
    const { toasts, dismiss } = useToast();
    
    return (
        <div
            className={`${style.toaster} ${style[position]}`}
            aria-label="Notificaciones"
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} dismiss={dismiss} />
            ))}
        </div>
    );
}