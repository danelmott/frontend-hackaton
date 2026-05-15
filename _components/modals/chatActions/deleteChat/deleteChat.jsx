"use client";

import { useEffect, useRef } from "react";
import style from "./deleteChat.module.css";

export default function DeleteChatModal({ open, onClose, onConfirm, chatName }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) dialog.showModal();
        else dialog.close();
    }, [open]);

    const handleConfirm = () => {
        onConfirm?.();
        onClose?.();
    };

    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) onClose?.();
    };

    return (
        <dialog
            ref={dialogRef}
            className={style.dialog}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className={style.modal}>
                <div className={style.iconWrapper}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>

                <div className={style.content}>
                    <h2 className={style.title}>Eliminar chat</h2>
                    <p className={style.description}>
                        ¿Estás seguro que quieres eliminar
                        {chatName && <strong> "{chatName}"</strong>}?
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className={style.footer}>
                    <button className={style.cancelBtn} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className={style.deleteBtn} onClick={handleConfirm}>
                        Eliminar
                    </button>
                </div>
            </div>
        </dialog>
    );
}