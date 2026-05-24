'use client';
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({children}) {
    const [modal, setModal] = useState({ type: null, data: null });
    const openModal = useCallback((type, data = null) => setModal({ type, data }), []);
    const closeModal = useCallback(() => setModal({ type: null, data: null }), []);

    const value = useMemo(
        () => ({ modal, openModal, closeModal }),
        [modal, openModal, closeModal]
    );
    
    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext);
    if(!context) throw new Error("useModal debe ser usado dentro de <ModalProvider>");
    return context;
}