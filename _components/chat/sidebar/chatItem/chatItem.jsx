'use client';
import { useState } from 'react';
import { useModal } from '@/_contexts/modalContext';
import style from './chatItem.module.css';
import { Icon } from '@/_components/icon/icon';
import ChatMenu from '../chatMenu/chatMenu';


export default function ChatItem({chat, active}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();
    
    const handleAction = (actionId) => {
        switch(actionId) {
            case "update_chat":
                setMenuOpen(false);
                openModal("update_chat", {
                    currentName: chat.title,
                    onConfirm: (newName) => {
                        console.log("renombrar: ", newName);
                    }
                });
            case "delete_chat":
                setMenuOpen(false);
                openModal("delete_chat", {
                    chatName: chat.title,
                    onConfirm: () => {
                        console.log("eliminar:", chat.id)
                    }
                })
        }
    }
    
    return (
        <div className={`${style.chatItem} ${active ? style.active : ''}`}>
            <span className={style.chatTitle}>{chat.title}</span>
            <div className={style.menuWrapper}>
                <button
                    className={style.menuBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => !prev);
                    }}
                    aria-label='Opciones'
                >
                    <Icon name='more_vert' size='lg'/>
                </button>
                <ChatMenu 
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
}