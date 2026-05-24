"use client";

import { useState } from "react";
import Sidebar from "@/_components/chat/sidebar/sidebar";
import { Icon } from "@/_components/icon/icon";
import Image from "next/image";
import styles from "./layout.module.css";

export default function ChatLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

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