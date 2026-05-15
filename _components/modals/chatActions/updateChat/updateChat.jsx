"use client";
import { useEffect, useRef, useState } from "react";
import style from './updateChat.module.css'

export default function UpdateChatModal({ open, onClose, onConfirm, currentName }) {
    const dialogRef = useRef(null);
    const inputRef = useRef(null);
    const [value, setValue] = useState(currentName ?? "");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            setValue(currentName ?? "");
            dialog.showModal();
            setTimeout(() => inputRef.current?.select(), 50);
        } else {
            dialog.close();
        }
    }, [open]);

    const handleConfirm = () => {
        if (!value.trim()) return;
        onConfirm?.(value.trim());
        onClose?.();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleConfirm();
    };

    // cerrar al click en el backdrop
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
                <div className={style.header}>
                    <h2 className={style.title}>Renombrar chat</h2>
                    <button className={style.closeBtn} onClick={onClose} aria-label="Cerrar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={style.body}>
                    <input
                        ref={inputRef}
                        className={style.input}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nombre del chat"
                        maxLength={100}
                    />
                    <span className={style.counter}>{value.length}/100</span>
                </div>

                <div className={style.footer}>
                    <button className={style.cancelBtn} onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className={style.confirmBtn}
                        onClick={handleConfirm}
                        disabled={!value.trim() || value.trim() === currentName}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </dialog>
    );
}