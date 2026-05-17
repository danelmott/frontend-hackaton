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
                <div className={style.content}>
                    <h2 className={style.title}>Eliminar chat</h2>
                    <p className={style.description}>
                        ¿Estás seguro que quieres eliminar este chat?
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