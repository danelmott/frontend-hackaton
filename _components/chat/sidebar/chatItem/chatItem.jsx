'use client';
import style from './chatItem.module.css';
import { Icon } from '@/_components/icon/icon';
import ChatMenu from '../chatMenu/chatMenu';
import useChatItem from '@/_services/chat/useChatItem';

export default function ChatItem({chat, active, onSelect}) {
    const {menuOpen, setMenuOpen, handleAction} = useChatItem(chat);
    
    const isDestacado = chat.isStarred || chat.starred || chat.pinned;
    
    return (
        <div
            className={`${style.chatItem} ${active ? style.active : ''}`}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
        >
            {isDestacado && (
                <span className={style.starIcon} aria-label="Chat destacado">
                    <Icon name='star' size='sm' filled />
                </span>
            )}
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
                    <Icon name='more_vert' size='sm'/>
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