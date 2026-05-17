'use client';
import style from './chatItem.module.css';
import { Icon } from '@/_components/icon/icon';
import ChatMenu from '../chatMenu/chatMenu';
import useChatItem from '@/_services/useChatItem';

export default function ChatItem({chat, active}) {
    const {menuOpen, setMenuOpen, handleAction} = useChatItem(chat);
    
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