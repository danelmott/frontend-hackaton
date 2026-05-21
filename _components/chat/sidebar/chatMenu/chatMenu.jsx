"use client";
import { useEffect, useRef } from "react";
import style from "./chatMenu.module.css";
import { Icon } from "@/_components/icon/icon";

const MENU_ITEMS = [
    { id: "highlight_chat", label: "Destacar", icon: "star"              , filled: true},
    { id: "update_chat",    label: "Renombrar",icon: "edit"              , filled: false},
    { id: "archive_chat",   label: "Archivar", icon: "create_new_folder" , filled: false, },
    { id: "delete_chat",    label: "Eliminar", icon: "delete", danger: true , filled: false},
];

export default function ChatMenu({ open, onClose, onAction }) {
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        const keyHandler = (e) => e.key === "Escape" && onClose?.();
        document.addEventListener("click", handler);
        document.addEventListener("keydown", keyHandler);
        return () => {
            document.removeEventListener("click", handler);
            document.removeEventListener("keydown", keyHandler);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div ref={menuRef} className={style.menu}>
            {MENU_ITEMS.map((item, i) => {
                if (!item) return <div key={`d-${i}`} className={style.divider} />;
                return (
                    <button
                        key={item.id}
                        className={`${style.item} ${item.danger ? style.danger : ""}`}
                        onClick={() => {
                            onAction?.(item.id);
                            onClose?.();
                        }}
                    >
                        <Icon name={item.icon} size="md" filled={item.filled} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}