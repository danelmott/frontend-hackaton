'use client';
import { createContext, useContext, useCallback, useRef, useState } from "react";

const ToastContext = createContext(null);

let externalDispatch = null;

export function ToastProvider({children}) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});
    
    const dimiss = useCallback((id) => {
        setToast((prev) =>
            prev.map((t) => (t.id === id) ? {...t, removing: true}: t)
        );
        clearTimeout(timers.current[id]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            delete timers.current[id]
        }, 350)
    }, []);
    
    
    const toast = useCallback(
        (message, options = {}) => {
            const id = crypto.randomUUID();
            const duration = options.duration ?? 4000;
            
            setToasts((prev) => {
                const next = [{id, message, removing: false, ...options}, ...prev];
                return next.slice(0, 5);
            })
            
            if(duration !== Infinity) {
                timers.current[id] = setTimeout(() => dimiss(id), duration);
            }
            
            return id;
        },
        [dimiss]
    );
    
    externalDispatch = toast;
    
    return(
        <ToastContext.Provider value={{toasts, toast, dimiss}}>
            {children}
        </ToastContext.Provider>
    )
}


export function useToast() {
    const context = useContext(ToastContext);
    if(!context) throw new Error("useToast debe ser usado dentro de <ToastProvider>");
    
    return context;
}

export const toastApi =  {
    show: (msg, opts) => externalDispatch?.(msg, opts),
    success: (msg, opts) => externalDispatch?.(msg, {type: 'success', ...opts}),
    error: (msg, opts) => externalDispatch?.(msg, {type: 'error', ...opts}),
    warning: (msg, opts) => externalDispatch?.(msg, {type: 'warning', ...opts}),
    info: (msg, opts) => externalDispatch?.(msg, {type: 'info', ...opts}),
    loading: (msg, opts) =>
        externalDispatch?.(msg, {type: 'loading', duration: Infinity, ...opts})
}