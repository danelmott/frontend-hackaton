'use client';
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({children}) {
    const [modal, setModal] = useState({type: 'null', data: 'null'});
    const openModal = (type, data = null) => setModal({type, data});
    const closeModal = () => setModal({type: null, data: null});
    
    return (
        <ModalContext.Provider value={{modal, openModal, closeModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext);
    if(!context) throw new Error("useModal debe ser usado dentro de <ModalProvider>");
    return context;
}