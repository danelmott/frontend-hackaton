'use client';
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MODAL_TYPES } from "@/_constants/modalTypes";

const ModalContext = createContext();

export function ModalProvider({children}) {
    const [modal, setModal] = useState({ type: null, data: null });
    const openModal = useCallback((type, data = null) => setModal({ type, data }), []);
    const closeModal = useCallback(() => setModal({ type: null, data: null }), []);

    const openLoginModal = useCallback(() => openModal(MODAL_TYPES.LOGIN), [openModal]);
    const openSignupModal = useCallback(() => openModal(MODAL_TYPES.SIGNUP), [openModal]);
    const openVerifyModal = useCallback(
        (email) => openModal(MODAL_TYPES.VERIFY, { email }),
        [openModal]
    );

    const value = useMemo(
        () => ({
            modal,
            openModal,
            closeModal,
            openLoginModal,
            openSignupModal,
            openVerifyModal,
        }),
        [modal, openModal, closeModal, openLoginModal, openSignupModal, openVerifyModal]
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