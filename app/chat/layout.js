"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/_components/chat/sidebar/sidebar";
import { Icon } from "@/_components/icon/icon";
import styles from "./layout.module.css";
import { ChatProvider } from "@/_contexts/chatContext";
import { useAuth } from "@/_contexts/authContext";
import { useModal } from "@/_contexts/modalContext";

function ChatLayoutContent({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading } = useAuth();
    const { modal, openModal } = useModal();
    const hasPromptedLogin = useRef(false);

    useEffect(() => {
        if (loading) return;

        if (user) {
            hasPromptedLogin.current = false;
            return;
        }

        if (hasPromptedLogin.current || modal.type === 'login') return;

        hasPromptedLogin.current = true;
        openModal('login');
    }, [loading, user, modal.type, openModal]);

    return (
        <div className={styles.layout}>
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            )}

            <div className={styles.main}>
                <header className={styles.header}>
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <Icon name="menu" size="md" />
                    </button>
 
                </header>

                {children}
            </div>
        </div>
    );
}

export default function ChatLayout({ children }) {
    return (
        <ChatProvider>
            <ChatLayoutContent>{children}</ChatLayoutContent>
        </ChatProvider>
    );
}